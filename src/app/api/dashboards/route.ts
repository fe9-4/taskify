import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import apiClient from "../apiClient";
import { cookies } from "next/headers";
<<<<<<< HEAD
import { creatDashboard } from "@/types/dashboardType";
=======
import { CreateDashboard } from "@/types/dashboardType";
>>>>>>> develop

// 내 대시보드 상단 대시보드 목록 조회 (cursorId 포함)
export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const cursorId = searchParams.get("cursorId");
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "10";

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 401 });
  }

<<<<<<< HEAD
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
      const dashboards = response.data.dashboards;
      const totalCount = response.data.totalCount;
      const cursorId = response.data.cursorId;

      return NextResponse.json({ dashboards, totalCount, cursorId }, { status: 200 });
=======
  try {
    let url = `/dashboards?navigationMethod=pagination&page=${page}&size=${size}`;
    if (cursorId) {
      url += `&cursorId=${cursorId}`;
    }

    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
>>>>>>> develop
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 목록 GET 요청에서 오류 발생", error);
      return NextResponse.json(
        { error: "대시보드 정보 가져오기 실패", message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "알 수 없는 오류 발생" }, { status: 500 });
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
    const formData: CreateDashboard = await request.json();
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
