import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 모바일 10개, 태블릿 15개, 데스크탑 15개
  const query = { navigationMethod: "pagination", cursorId: 1, page: 1, size: 10 };
  const { navigationMethod, cursorId, page, size } = query;
  const requestUrl = `/9-4/dashboards?navigationMethod=${navigationMethod}&cursorId=${cursorId}&page=${page}&size=${size}`;

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
