import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Place from "../../../../models/Place";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const deity = searchParams.get("deity");
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const architecture = searchParams.get("architecture");

    let query = { 
      isActive: true, 
      approvalStatus: 'approved' 
    };

    if (region) {
      const normalizedRegion = region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
      
      const validRegions = ["North", "South", "East", "West"];
      if (validRegions.includes(normalizedRegion)) {
        query.region = normalizedRegion;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid region. Valid regions are: ${validRegions.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Add other filters if provided
    if (deity) {
      query.deity = { $regex: deity, $options: 'i' };
    }

    if (state) {
      query["location.state"] = { $regex: state, $options: 'i' };
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: 'i' };
    }

    if (architecture) {
      query.architecture = { $regex: architecture, $options: 'i' };
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let places;
    let totalCount;

    if (search) {
      const searchQuery = {
        $text: { $search: search },
        ...query
      };

      places = await Place.find(searchQuery)
        .select('name deity location builtBy architecture image slug region createdAt')
        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

      totalCount = await Place.countDocuments(searchQuery);
    } else {
      places = await Place.find(query)
        .select('name deity location builtBy architecture image slug region createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

      totalCount = await Place.countDocuments(query);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    return NextResponse.json(
      {
        success: true,
        data: places,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          limit: limitNumber,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          region: region || null,
          deity: deity || null,
          state: state || null,
          city: city || null,
          architecture: architecture || null,
          search: search || null,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching places by query:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch places",
        details: error.message,
      },
      { status: 500 }
    );
  }
}