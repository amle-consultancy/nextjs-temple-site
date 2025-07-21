import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { put, del } from "@vercel/blob";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    // Check authentication
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

    // Check if user has permission to upload images
    const allowedRoles = ["Admin", "Evaluator", "Support Admin"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions to upload images",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No image file provided",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size (2.5MB = 2.5 * 1024 * 1024 bytes)
    const maxSize = 2.5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 2.5MB limit",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `temple-images/${timestamp}-${randomString}.${fileExtension}`;

    try {
      // Get the token from environment variables
      const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.TEMPLE_SITE_READ_WRITE_TOKEN;
      
      if (!token) {
        throw new Error("Blob storage token not configured");
      }

      // Upload to Vercel Blob Storage
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
        token: token,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Image uploaded successfully",
          data: {
            url: blob.url,
            filename: filename,
            size: file.size,
            type: file.type,
          },
        },
        { status: 200 }
      );
    } catch (uploadError) {
      console.error("Vercel Blob upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload image to storage",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during image upload",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete image from Vercel Blob Storage
export async function DELETE(request) {
  try {
    // Check authentication
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

    // Check if user has permission to delete images
    const allowedRoles = ["Admin", "Evaluator", "Support Admin"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions to delete images",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Image URL is required",
        },
        { status: 400 }
      );
    }

    // Validate that the URL is from Vercel Blob Storage
    if (!imageUrl.includes("blob.vercel-storage.com")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid image URL. Only Vercel Blob Storage URLs are allowed",
        },
        { status: 400 }
      );
    }

    try {
      // Get the token from environment variables
      const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.TEMPLE_SITE_READ_WRITE_TOKEN;
      
      if (!token) {
        throw new Error("Blob storage token not configured");
      }

      // Delete from Vercel Blob Storage
      await del(imageUrl, { token: token });

      return NextResponse.json(
        {
          success: true,
          message: "Image deleted successfully",
        },
        { status: 200 }
      );
    } catch (deleteError) {
      console.error("Vercel Blob delete error:", deleteError);
      
      // If the file doesn't exist, consider it a success
      if (deleteError.message && deleteError.message.includes("not found")) {
        return NextResponse.json(
          {
            success: true,
            message: "Image was already deleted or does not exist",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete image from storage",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during image deletion",
      },
      { status: 500 }
    );
  }
}