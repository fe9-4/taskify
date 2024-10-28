import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

interface IParams {
  dashboardId: number;
}
// https://sp-taskify-api.vercel.app/9-4/dashboards/12067/invitations?page=1&size=10
export const GET = async (request: NextRequest, { params }: { params: IParams }) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;
  const dashboardId = params.dashboardId;
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(Number(dashboardId))) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data.data;
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 초대 내역 GET 요청 오류 발생", error);
      return new NextResponse("대시보드 초대 내역 조회 실패", { status: error.status });
    }
  }
};

// 대시보드 초대하기
export const POST = async (request: NextRequest, { params }: { params: { dashboardId: string } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const { dashboardId } = params;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const response = await apiClient.post(`/dashboards/${dashboardId}/invitations`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "컬럼 생성 실패" }), { status: error.status });
    }
  }
};
