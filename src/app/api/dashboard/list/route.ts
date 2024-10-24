import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 모바일 10개, 태블릿 15개, 데스크탑 15개
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;

  const requestUrl = `/9-4/dashboards?navigationMethod=pagination&page=${page}&size=${size}`;
  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const response = await apiClient.get(requestUrl, {
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
