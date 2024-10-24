import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "@/app/api/apiClient";

export const GET = async ({ params }: { params: { dashboardId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const dashboardId = params.dashboardId;

    const response = await apiClient.get(`/members/${dashboardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("멤버 조회 중 오류 발생: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return new NextResponse("멤버 조회 중 오류가 발생했습니다.", { status: 500 });
  }
};
