import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Place from "../../../../models/Place";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// GET - Fetch temples by tags (deity or architecture) with pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const deity = searchParams.get("deity");
    const architecture = searchParams.get("architecture");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 15;

    // Validate that at least one tag parameter is provided
    if (!deity && !architecture) {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'deity' or 'architecture' parameter is required",
          message: "Please provide either deity (e.g., ?deity=vishnu) or architecture (e.g., ?architecture=dravidian) parameter"
        },
        { status: 400 }
      );
    }

    // Validate that both parameters are not provided simultaneously
    if (deity && architecture) {
      return NextResponse.json(
        {
          success: false,
          error: "Only one tag parameter allowed at a time",
          message: "Please provide either 'deity' OR 'architecture' parameter, not both"
        },
        { status: 400 }
      );
    }

    // Build query for approved and active temples only (public API)
    let query = {
      isActive: true,
      approvalStatus: "approved"
    };

    // Add tag-specific filter
    if (deity) {
      // Case-insensitive search for deity
      query.deity = { $regex: new RegExp(deity, 'i') };
    }

    if (architecture) {
      // Case-insensitive search for architecture
      query.architecture = { $regex: new RegExp(architecture, 'i') };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalCount = await Place.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch temples with pagination
    const temples = await Place.find(query)
      .select('name deity location architecture about builtBy constructionPeriod image mapsLink contact createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Determine the tag type and value for response
    const tagType = deity ? 'deity' : 'architecture';
    const tagValue = deity || architecture;

    return NextResponse.json(
      {
        success: true,
        data: {
          temples,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          },
          tag: {
            type: tagType,
            value: tagValue,
            originalValue: deity || architecture
          }
        },
        message: `Found ${temples.length} temples for ${tagType}: ${tagValue}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching temples by tags:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch temples",
        message: "An internal server error occurred while fetching temples"
      },
      { status: 500 }
    );
  }
}

// GET method to fetch available tags (optional endpoint for getting all unique deities and architectures)
export async function OPTIONS(request) {
  try {
    await connectDB();

    // Get all unique deities
    const deities = await Place.distinct('deity', {
      isActive: true,
      approvalStatus: 'approved',
      deity: { $exists: true, $ne: null, $ne: '' }
    });

    // Get all unique architectures
    const architectures = await Place.distinct('architecture', {
      isActive: true,
      approvalStatus: 'approved',
      architecture: { $exists: true, $ne: null, $ne: '' }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          deities: deities.filter(d => d).sort(),
          architectures: architectures.filter(a => a).sort(),
          totalDeities: deities.length,
          totalArchitectures: architectures.length
        },
        message: "Available tags fetched successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching available tags:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch available tags"
      },
      { status: 500 }
    );
  }
}