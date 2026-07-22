import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
      connected: true,
      message: "MongoDB Connected Successfully",
    });
  } catch (error) {
    return Response.json(
      {
        connected: false,
        error,
      },
      { status: 500 }
    );
  }
}