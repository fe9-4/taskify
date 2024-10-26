import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";
import axios from "axios";
import { creatDashboard } from "@/types/dashboardType";

// 대시보드 조회
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const requestUrl = `/dashboards?navigationMethod=pagination&page=${page}&size=${size}`;
  
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

// 대시보드 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData: creatDashboard = await request.json();
    const response = await apiClient.post("/dashboards", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "대시보드 생성 실패" }), { status: error.status });
    }
  }
};