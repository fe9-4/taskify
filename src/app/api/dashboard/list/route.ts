import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const response = await apiClient.get("/dashboards?navigationMethod=pagination&cursorId=1&page=1&size=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
