import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { accessToken } = await request.json();

  if (accessToken) {
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1800, // 30분
      path: "/",
    });
    return NextResponse.json({ message: "accessToken이 성공적으로 설정되었습니다." });
  }

  return NextResponse.json({ message: "accessToken이 제공되지 않았습니다." }, { status: 400 });
}
