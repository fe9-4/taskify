import axios from "axios"
import { NextResponse } from "next/server";
import apiClient from "../apiClient";
import config from "@/constants/config";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  
  try {
    const response = await apiClient.get(`${process.env.NEXT_PUBLIC_API_URL}/${config.TEAM_ID}/dashboards?navigationMethod=pagination&cursorId=1&page=${page}&size=5`);

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