import axios from "axios"
import apiClient from "../apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }
  
  try {
    const response = await apiClient.get(`/dashboards?navigationMethod=pagination&cursorId=1&page=${page}&size=5`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const dashboardList = response.data.dashboards;
      const totalCount = response.data.totalCount;

      return NextResponse.json({ dashboardList, totalCount }, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("myDashboard GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 정보 가져오기 실패", { status: error.status });
    }
  }
}