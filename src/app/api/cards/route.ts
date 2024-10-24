import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "@/app/api/apiClient";

// YYYY-MM-DD HH:MM 형식으로 날짜를 포맷팅하는 함수
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 할 일 생성
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
    const response = await apiClient.post("/cards", newCard, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("카드 생성 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "카드 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
};

// 할 일 수정
export const PUT = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const response = await apiClient.put("/cards", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 수정 오류", error);
      return new NextResponse("할 일 수정 실패", { status: error.status });
    }
  }
};
