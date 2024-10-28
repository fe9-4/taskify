import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

interface IParams {
  dashboardId: number;
  invitationId: number;
}
export const GET = async (request: NextRequest, { params }: { params: IParams }) => {
  const dashboardId = params.dashboardId;
  const invitationId = params.invitationId;
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(Number(dashboardId))) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    //https://sp-taskify-api.vercel.app/9-4/dashboards/12067/invitations/13476
    const response = await apiClient.get(`/dashboards/${dashboardId}/invitations/${invitationId}`, {
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
