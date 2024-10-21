import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    return NextResponse.json({ accessToken: accessToken.value });
  }

  return NextResponse.json({ accessToken: null }, { status: 200 });
}
