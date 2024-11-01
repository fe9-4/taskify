import axios from "axios";
import apiClient from "../apiClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(req.url);
  const size = searchParams.get("size");
  const cursorId = Number(searchParams.get("cursorId")) || null;
  
  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!size) {
    return new NextResponse("초대목록 조회 요청값을 확인해주세요.", { status: 400 });
  }
  
  try {
    const response = await apiClient.get(`/invitations?size=${size}${cursorId !== null ? `&cursorId=${cursorId}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const data = response.data;
      
      const inviteList = data.invitations;
      const cursorId = data.cursorId;
      return NextResponse.json({ inviteList, cursorId }, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("내 대시보드 초대목록 GET api에서 오류 발생", error);
      return new NextResponse("초대목록 조회 실패", { status: error.status });
    }
  }
}