import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

interface IParams {
  dashboardId: number;
}

// 대시보드로 초대한 목록 가져오기
export const GET = async (request: NextRequest, { params }: { params: IParams }) => {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;
  const { dashboardId } = params;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 401 });
  }

  if (isNaN(Number(dashboardId))) {
    return NextResponse.json({ error: "대시보드 정보 가져오기 실패" }, { status: 400 });
  }

  try {
    const response = await apiClient.get(`/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200 && response.data) {
      // 응답 데이터 구조 통일
      return NextResponse.json(
        {
          invitations: response.data.invitations || [],
          totalCount: response.data.totalCount || 0,
        },
        { status: 200 }
      );
    }

    // 데이터가 없는 경우
    return NextResponse.json(
      {
        invitations: [],
        totalCount: 0,
      },
      { status: 200 }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 초대 내역 GET 요청 오류 발생", error);
      return NextResponse.json(
        {
          error: error.response?.data?.message || "대시보드 초대 내역 조회 실패",
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
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

    if (response.status === 201) {
      return NextResponse.json(response.data, { status: 201 });
    }

    return NextResponse.json({ error: "초대하기 실패" }, { status: 400 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.message || "초대하기 실패",
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
};
