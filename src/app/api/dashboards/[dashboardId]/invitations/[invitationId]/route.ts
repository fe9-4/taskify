import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

interface IParams {
  dashboardId: number;
  invitationId: number;
}
export const DELETE = async (request: NextRequest, { params }: { params: IParams }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  const dashboardId = params.dashboardId;
  const invitationId = params.invitationId;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(Number(dashboardId))) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    //https://sp-taskify-api.vercel.app/9-4/dashboards/12067/invitations/13476
    const response = await apiClient.delete(`/dashboards/${dashboardId}/invitations/${invitationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    // 204가 아닌 경우의 응답 추가
    return NextResponse.json({ message: "초대 삭제 실패" }, { status: 400 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 초대 내역 DELETE 요청 오류 발생", error);
      return NextResponse.json({ error: "초대 삭제 실패" }, { status: error.status || 500 });
    }
    // 일반 에러의 경우 응답 추가
    return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다" }, { status: 500 });
  }
};
