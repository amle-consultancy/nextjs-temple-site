import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Place from "../../../models/Place";
import User from "../../../models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import { performFuseSearch } from "@/lib/fuseSearch";

// Function to generate slug from temple name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Function to ensure unique slug
async function generateUniqueSlug(baseName) {
  let slug = generateSlug(baseName);
  let counter = 1;
  let originalSlug = slug;

  // Check if slug already exists
  while (await Place.findOne({ slug })) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export const dynamic = "force-dynamic";

// GET - Fetch all places
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const deity = searchParams.get("deity");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "Admin";
    const isEvaluator = session?.user?.role === "Evaluator";
    const isSupportAdmin = session?.user?.role === "Support Admin";

    let query = { isActive: true };

    if (!session || (!isAdmin && !isEvaluator && !isSupportAdmin)) {
      query.approvalStatus = "approved";
    }

    if ((isAdmin || isEvaluator || isSupportAdmin) && status) {
      query.approvalStatus = status;
    }

    if (state) {
      query["location.state"] = state;
    }
    if (city) {
      query["location.city"] = city;
    }
    if (deity) {
      query.deity = deity;
    }

    let places;
    if (search) {
      if (!session || (!isAdmin && !isEvaluator && !isSupportAdmin)) {
        const textSearchResults = await Place.searchPlaces(search, 20).lean();

        if (textSearchResults.length >= 5) {
          places = await Place.searchPlaces(search, 20).sort({ createdAt: -1 });
        } else {
          const allPlaces = await Place.find({
            isActive: true,
            approvalStatus: "approved",
          }).lean();

          if (allPlaces.length > 0) {
            const fuseResults = performFuseSearch(allPlaces, search);

            if (fuseResults.length > 0) {
              const placeIds = fuseResults.map((place) => place._id);
              places = await Place.find({ _id: { $in: placeIds } }).sort({
                createdAt: -1,
              });
            } else {
              places = await Place.searchPlaces(search, 20).sort({
                createdAt: -1,
              });
            }
          } else {
            places = [];
          }
        }
      } else {
        const adminPlaces = await Place.find({
          $text: { $search: search },
          ...query,
        })
          .populate("createdBy", "name email role")
          .populate("approvedBy", "name email role")
          .lean();

        if (adminPlaces.length < 5) {
          const allAdminPlaces = await Place.find(query)
            .populate("createdBy", "name email role")
            .populate("approvedBy", "name email role");

          const fuseResults = performFuseSearch(allAdminPlaces, search);

          if (fuseResults.length > 0) {
            const placeIds = fuseResults.map((place) => place._id);
            places = await Place.find({ _id: { $in: placeIds }, ...query })
              .populate("createdBy", "name email role")
              .populate("approvedBy", "name email role")
              .sort({ createdAt: -1 });
          } else {
            places = await Place.find({
              $text: { $search: search },
              ...query,
            })
              .populate("createdBy", "name email role")
              .populate("approvedBy", "name email role")
              .sort({ createdAt: -1 });
          }
        } else {
          places = adminPlaces;
        }
      }
    } else {
      const populateFields =
        isAdmin || isEvaluator || isSupportAdmin
          ? ["createdBy", "name email role"]
          : [];

      if (populateFields.length > 0) {
        places = await Place.find(query)
          .populate("createdBy", "name email role")
          .populate("approvedBy", "name email role")
          .sort({ createdAt: -1 });
      } else {
        places = await Place.find(query).sort({ createdAt: -1 });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: places,
        count: places.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch places",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      deity,
      region,
      state,
      city,
      district,
      pincode,
      architecture,
      about,
      builtBy,
      constructionPeriod,
      significance,
      phone,
      website,
      mapsLink,
      image,
      festivals,
    } = body;

    if (
      !name ||
      !deity ||
      !region ||
      !state ||
      !city ||
      !pincode ||
      !architecture ||
      !about
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, deity, region, state, city, pincode, architecture, and about are required fields",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          success: false,
          error: "Pincode must be exactly 6 digits",
        },
        { status: 400 }
      );
    }

    const existingPlace = await Place.findOne({
      name: name.trim(),
      "location.city": city.trim(),
      "location.state": state.trim(),
    });

    if (existingPlace) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A place with this name already exists in the same city and state",
        },
        { status: 409 }
      );
    }

    let approvalStatus = "pending";
    let approvedBy = null;
    let approvedAt = null;

    if (session.user.role === "Admin") {
      approvalStatus = "approved";
      approvedBy = session.user.id;
      approvedAt = new Date();
    }

    const slug = await generateUniqueSlug(name);

    const placeData = {
      name: name.trim(),
      deity: deity.trim(),
      region: region.trim(),
      location: {
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        ...(district && { district: district.trim() }),
      },
      architecture: architecture.trim(),
      about: about.trim(),
      ...(builtBy && { builtBy: builtBy.trim() }),
      ...(constructionPeriod && {
        constructionPeriod: constructionPeriod.trim(),
      }),
      ...(significance && { significance: significance.trim() }),
      contact: {
        ...(phone && { phone: phone.trim() }),
        ...(website && { website: website.trim() }),
      },
      ...(mapsLink && { mapsLink: mapsLink.trim() }),
      ...(image && { image: image.trim() }),
      festivals: festivals
        ? festivals.filter((f) => f.name && f.period && f.description)
        : [],
      createdBy: session.user.id,
      approvalStatus,
      ...(approvedBy && { approvedBy }),
      ...(approvedAt && { approvedAt }),
      slug,
    };

    const place = new Place(placeData);
    await place.save();

    await place.populate("createdBy", "name email role");
    if (approvedBy) {
      await place.populate("approvedBy", "name email role");
    }

    return NextResponse.json(
      {
        success: true,
        message: `Place created successfully${
          approvalStatus === "pending"
            ? " and is pending approval"
            : " and approved"
        }`,
        data: place,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating place:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "A place with this name already exists in the same location",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create place",
      },
      { status: 500 }
    );
  }
}
