import axios from "axios";
import apiClient from "../apiClient";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 댓글 조회
export const GET = async (request: Request) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId");
  const size = searchParams.get("size");

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  if (!cardId || !size) {
    return new NextResponse("카드 상세 정보에서 가져오는 데이터를 확인해주세요.", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/comments?size=${size}&cardId=${cardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "댓글 목록 조회 실패" }), { status: error.status });
    }
  }
};

// 댓글 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const response = await apiClient.post("/comments", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "댓글 생성 실패" }), { status: error.status });
    }
  }
};
