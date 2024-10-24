import axios from "axios";
import apiClient from "../../apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface IParams {
  dashboardId: number;
}

export const GET = async (req: Request, { params }: { params: IParams }) => {
  const { dashboardId } = params; 
  const id = Number(dashboardId);
  
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(id)) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/columns?dashboardId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      const data = response.data.data;
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 조회 실패", { status: error.status });
    }
  }
}