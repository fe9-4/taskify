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
