import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Place from "../../../../models/Place";
import { authOptions } from "../../auth/[...nextauth]/route";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

// POST - Approve or reject a place
export async function POST(request) {
  try {
    await connectDB();

    // Get session to check user authentication and role
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

    // Check if user has permission to approve places (Admin or Evaluator)
    if (session.user.role !== "Admin" && session.user.role !== "Evaluator") {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions. Only Admin and Evaluator can approve places.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { placeId, action, rejectionReason } = body;

    // Validate required fields
    if (!placeId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: "Place ID and action are required",
        },
        { status: 400 }
      );
    }

    // Validate action
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Action must be either 'approve' or 'reject'",
        },
        { status: 400 }
      );
    }

    // If rejecting, rejection reason is required
    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        {
          success: false,
          error: "Rejection reason is required when rejecting a place",
        },
        { status: 400 }
      );
    }

    // Find the place
    const place = await Place.findById(placeId).populate("createdBy", "name email role");
    if (!place) {
      return NextResponse.json(
        {
          success: false,
          error: "Place not found",
        },
        { status: 404 }
      );
    }

    // Check if place is already processed
    if (place.approvalStatus !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `Place is already ${place.approvalStatus}`,
        },
        { status: 400 }
      );
    }

    // Update place based on action
    const updateData = {
      approvalStatus: action === "approve" ? "approved" : "rejected",
      approvedBy: session.user.id,
      approvedAt: new Date(),
    };

    if (action === "reject") {
      updateData.rejectionReason = rejectionReason.trim();
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      updateData,
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("approvedBy", "name email role");

    return NextResponse.json(
      {
        success: true,
        message: `Place ${action === "approve" ? "approved" : "rejected"} successfully`,
        data: updatedPlace,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing place approval:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process place approval",
      },
      { status: 500 }
    );
  }
}