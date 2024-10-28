import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apiClient from "../../apiClient";
import axios from "axios";

// 컬럼 수정
export const PUT = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();

    const columnsId = formData.columnId;
    const response = await apiClient.put(
      `/columns/${columnsId}`,
      { title: formData.title },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "컬럼 수정 실패" }), { status: error.status });
    }
  }
};
