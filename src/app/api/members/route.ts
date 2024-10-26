import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { apiClient } from "@/app/api/apiClient";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ message: "인증되지 않은 요청입니다." }, { status: 401 });
    }

    // URL에서 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const dashboardId = searchParams.get("dashboardId");
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";

    // dashboardId가 없으면 에러 반환
    if (!dashboardId || dashboardId === "0") {
      return NextResponse.json({ message: "대시보드 ID가 필요합니다." }, { status: 400 });
    }

    const response = await apiClient.get("/members", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        dashboardId,
        page,
        size,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    }

    return NextResponse.json({ message: "대시보드 멤버 목록 조회에 실패했습니다." }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);
      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
