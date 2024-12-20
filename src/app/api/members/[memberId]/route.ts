import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { apiClient } from "@/app/api/apiClient";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: number } }
): Promise<NextResponse> {
  const accessToken = cookies().get("accessToken")?.value;
  const { memberId } = params;

  if (accessToken) {
    try {
      await apiClient.delete(`/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("할 일 카드 삭제 중 오류 발생: ", error);

        if (error.response) {
          return NextResponse.json({ message: error.response.data.message }, { status: error.status });
        }
      }
    }
  } else {
    return NextResponse.json({ message: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  try {
    const response = await apiClient.delete(`/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json({ message: "멤버 삭제 실패" }, { status: 400 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("멤버 삭제 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json(
          { message: error.response.data.message || "멤버 삭제 실패" },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json({ message: "멤버 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
