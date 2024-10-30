import apiClient from "@/app/api/apiClient";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface IBody {
  id: number;
  inviteAccepted: boolean;
}

export const PUT = async (req: Request) => {
  const body = await req.json();
  const { id, inviteAccepted }: IBody = body;

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!id || inviteAccepted === null) {
    return new NextResponse("요청에 필요한 값이 없습니다.", { status: 400 });
  }
  if (token) {
    try {
      const response = await apiClient.put(
        `/invitations/${id}`,
        {
          inviteAccepted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 초대 수락 PUT 요청에서 오류 발생", error);
        return new NextResponse(error.response?.data.message, { status: error.status });
      }
    }
  } else {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }
};
