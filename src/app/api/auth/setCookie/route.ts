import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { accessToken } = await request.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1800, // 30분
    path: "/",
  });

  return response;
}
