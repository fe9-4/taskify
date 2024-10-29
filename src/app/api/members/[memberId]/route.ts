import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { apiClient } from "@/app/api/apiClient";

export async function DELETE(request: NextRequest, { params }: { params: { memberId: number } }) {
  const accessToken = cookies().get("accessToken")?.value;
  const { memberId } = params;

  if (!accessToken) {
    return NextResponse.json({ message: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  try {
    await apiClient.delete(`/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("멤버 삭제 성공");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("멤버 삭제 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json(
          { message: error.response.data.message || "오류 발생" },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json({ error: "멤버 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
