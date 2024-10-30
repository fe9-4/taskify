import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "@/app/api/apiClient";

// 댓글 수정
export const PUT = async (request: NextRequest, { params }: { params: { commentId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const { commentId } = params;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const response = await apiClient.put(`/comments/${commentId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("댓글 수정 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json("댓글 수정 중 오류가 발생했습니다.", { status: 500 });
  }
};

// 댓글 삭제
export const DELETE = async (request: NextRequest, { params }: { params: { commentId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const { commentId } = params;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const response = await apiClient.delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("댓글 삭제 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "댓글 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
};
