import { NextRequest } from "next/server";

import User from "@/models/User";

import { JwtPayload, verifyAccessToken } from "@/lib/jwt";

import { connectDB } from "@/lib/db";
import { UnauthorizedError } from "@/lib/errors";

export async function auth(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyAccessToken(token) as JwtPayload;

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isDeleted) {
    throw new Error("Account deleted");
  }

  return user;
}