import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "인증되지 않은 요청입니다.", success: false }, { status: 200 });
  }

  return NextResponse.json({ message: "인증된 요청입니다.", success: true }, { status: 200 });
}
