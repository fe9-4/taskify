import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { apiClient } from "@/app/api/apiClient";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
): Promise<NextResponse> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ message: "인증되지 않은 요청입니다." }, { status: 401 });
    }

    const { memberId } = params;

    const response = await apiClient.delete(`/members/${memberId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return NextResponse.json({ message: "대시보드 멤버가 성공적으로 삭제되었습니다." }, { status: 204 });
    }

    return NextResponse.json({ message: "대시보드 멤버 삭제에 실패했습니다." }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 403) {
          return NextResponse.json({ message: error.response.data.message }, { status: 403 });
        }
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
