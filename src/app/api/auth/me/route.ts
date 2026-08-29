import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}