import axios from "axios";
import apiClient from "../../apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CreateDashboard } from "@/types/dashboardType";

interface IParams {
  dashboardId: number;
}

export const GET = async (req: Request, { params }: { params: IParams }) => {
  const { dashboardId } = params;
  const id = Number(dashboardId);

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(id)) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/columns?dashboardId=${id}&page=${page}&size=${size}`, {
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
      console.error("대시보드 상세페이지 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 조회 실패", { status: error.status });
    }
  }
};

// 대시보드 수정 api
interface ValueType {
  title: string;
  color: string;
}
export const PUT = async (req: Request, { params }: { params: IParams }) => {
  const dashboardId = params.dashboardId;
  const { title, color } = await req.json();

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(Number(dashboardId))) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }
  const requestBody: CreateDashboard = {
    title,
    color,
  };
  try {
    const response = await apiClient.put(`/dashboards/${dashboardId}`, requestBody, {
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
      console.error("대시보드 수정 요청에서 오류 발생", error);
      return new NextResponse("대시보드 수정 실패", { status: error.status });
    }
  }
};
