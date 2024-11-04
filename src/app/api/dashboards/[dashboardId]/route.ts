import axios from "axios";
import apiClient from "../../apiClient";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
interface IParams {
  dashboardId: number;
}
// 대시보드 상세 조회
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
    const response = await apiClient.get(`/dashboards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 조회 실패", { status: error.status });
    }
  }
};

// 대시보드 수정 api
export const PUT = async (req: Request, { params }: { params: IParams }) => {
  const { dashboardId } = params;
  const id = Number(dashboardId);

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!id) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    const requestBody = await req.json();

    const response = await apiClient.put(`/dashboards/${id}`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 수정 요청에서 오류 발생", error);
      return new NextResponse("대시보드 수정 실패", { status: error.response?.status || 500 });
    }
  }
};

// 대시보드 삭제
export const DELETE = async (request: NextRequest, { params }: { params: IParams }) => {
  const { dashboardId } = params;
  const id = Number(dashboardId);
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  if (!dashboardId || isNaN(id)) {
    return NextResponse.json({ error: "유효하지 않은 대시보드 ID입니다." }, { status: 400 });
  }

  try {
    const response = await apiClient.delete(`/dashboards/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 204 상태 코드 처리 수정
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // 다른 성공 상태 코드의 경우
    return NextResponse.json({ message: "대시보드가 삭제되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("대시보드 삭제 중 에러 발생:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "대시보드 삭제에 실패했습니다.";
      const statusCode = error.response?.status || 500;

      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
};
