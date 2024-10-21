import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { action, accessToken } = await request.json();

  if (action === "clear") {
    cookies().delete("accessToken");
    return NextResponse.json({ message: "쿠키가 성공적으로 삭제되었습니다." });
  } else if (action === "set" && accessToken) {
    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1800, // 30분
      path: "/",
    });
    return NextResponse.json({ message: "accessToken이 성공적으로 설정되었습니다." });
  }

  return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
}
