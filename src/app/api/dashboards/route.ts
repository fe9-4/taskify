import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import apiClient from "../apiClient";
import { cookies } from "next/headers";
import { creatDashboard } from "@/types/dashboardType";

// 내 대시보드 상단 대시보드 목록 조회 (cursorId 포함)
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const cursorId = searchParams.get("cursorId");
  const size = searchParams.get("size");

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!page || !cursorId || !size) {
    return new NextResponse("대시보드 조회 요청값을 확인해주세요.", { status: 400 });
  }

  try {
    const response = await apiClient.get(
      `/dashboards?navigationMethod=pagination&cursorId=${cursorId}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const dashboardList = response.data.dashboards;
      const totalCount = response.data.totalCount;
      const cursorId = response.data.cursorId;

      return NextResponse.json({ dashboardList, totalCount, cursorId }, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("myDashboard GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 정보 가져오기 실패", { status: error.status });
    }
  }
};

// 대시보드 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData: creatDashboard = await request.json();
    const response = await apiClient.post("/dashboards", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "대시보드 생성 실패" }), { status: error.status });
    }
  }
};
