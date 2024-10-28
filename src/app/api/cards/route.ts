import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "@/app/api/apiClient";
import { formatDateTime } from "@/utils/dateFormat";

// 할 일 카드 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { assigneeUserId, dashboardId, columnId, title, description, dueDate, tags, imageUrl } = body;

    // 태그를 JSON 문자열에서 배열로 변환
    const parsedTags = JSON.parse(tags);

    // dueDate를 YYYY-MM-DD HH:MM 형식으로 변환
    const formattedDueDate = dueDate ? formatDateTime(new Date(dueDate)) : null;

    // 새로운 카드 객체 생성
    const newCard = {
      assigneeUserId: Number(assigneeUserId),
      dashboardId: Number(dashboardId),
      columnId: Number(columnId),
      title,
      description,
      dueDate: formattedDueDate,
      tags: parsedTags,
      imageUrl,
    };

    // API 클라이언트를 사용하여 서버에 카드 생성 요청
    const response = await apiClient.post("/cards/", newCard, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 카드 생성 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "할 일 카드 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
};

// 카드 목록 조회
export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(req.url);
  const columnId = searchParams.get("columnId");
  const size = searchParams.get("size");

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!columnId || !size) {
    return new NextResponse("컬럼의 카드 정보를 가져오는 데이터를 확인해주세요.", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/cards?size=${size}&columnId=${columnId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 카드정보 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 상세페이지 카드정보 조회 실패", { status: error.status });
    }
  }
};
