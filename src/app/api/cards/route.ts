import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import apiClient from "@/app/api/apiClient";
import { CardProps } from "@/types/cardType";

// 할 일 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData: CardProps = await request.json();
    const response = await apiClient.post("/cards", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("할 일 생성 오류", error);
      return new NextResponse("할 일 생성 실패", { status: error.status });
    }
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
    const formData: CardProps = await request.json();
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

// 카드 목록 조회
export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(req.url);
  const cursorId = searchParams.get("cursorId");
  const columnId = searchParams.get("columnId");
  const size = searchParams.get("size");
  
  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!cursorId || !columnId || !size) {
    return new NextResponse("컬럼의 카드 정보를 가져오는 데이터를 확인해주세요.", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/cards?size=${size}&cursorId=${cursorId}&columnId=${columnId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
}