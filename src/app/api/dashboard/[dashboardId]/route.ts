import config from "@/constants/config";
import apiClient from "../../apiClient";
import { NextResponse } from "next/server";
import axios from "axios";

interface IParams {
  dashboardId: number;
}

export const GET = async (req: Request, { params }: { params: IParams}) => {
  const { dashboardId } = params; 
  console.log(typeof dashboardId)
  try {
    const response = await apiClient.get(`${process.env.NEXT_PUBLIC_API_URL}/${config.TEAM_ID}/columns?dashboardId=${dashboardId}`);

    if (response.status === 200) {
      const columnTitle = response.data.data.title;
      console.log(columnTitle)
      return NextResponse.json(columnTitle, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 조회 실패", { status: error.status });
    }
  }
}