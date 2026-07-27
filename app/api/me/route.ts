// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { JwtPayload } from "jsonwebtoken";


export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyAccessToken(token) as JwtPayload;
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id)
      .select("-password -refreshToken -__v")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is deleted or inactive
    if (user.isDeleted) {
      return NextResponse.json(
        { error: "Account has been deleted" },
        { status: 403 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        accountType: user.accountType,
        status: user.status,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}