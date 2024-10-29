import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "@/app/api/apiClient";
import { formatDateTime } from "@/utils/dateFormat";

// 할 일 카드 수정
export const PUT = async (request: NextRequest, { params }: { params: { cardId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const { cardId } = params;

    const body = await request.json();
    const { assigneeUserId, columnId, title, description, dueDate, tags, imageUrl } = body;

    // dueDate를 YYYY-MM-DD HH:MM 형식으로 변환
    const formattedDueDate = dueDate ? formatDateTime(new Date(dueDate)) : null;

    // 업데이트 카드 객체 생성
    const updatedData = {
      assigneeUserId: Number(assigneeUserId),
      columnId: Number(columnId),
      title,
      description,
      dueDate: formattedDueDate,
      tags,
      imageUrl,
    };

    const response = await apiClient.put(`/cards/${cardId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 카드 수정 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json("할 일 카드 수정 중 오류가 발생했습니다.", { status: 500 });
  }
};

// 할 일 카드 조회
export const GET = async (request: NextRequest, { params }: { params: { cardId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const cardId = params.cardId;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const response = await apiClient.get(`/cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 카드 조회 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "할 일 카드 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
};

// 할 일 카드 삭제
export const DELETE = async (request: NextRequest, { params }: { params: { cardId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const cardId = params.cardId;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const response = await apiClient.delete(`/cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 카드 삭제 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "할 일 카드 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
};
