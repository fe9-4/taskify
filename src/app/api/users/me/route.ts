import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

export const GET = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const response = await apiClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
};

export const PUT = async (request: Request) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nickname, profileImageUrl } = body;

    const response = await apiClient.put(
      "/users/me",
      { nickname, profileImageUrl },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    console.error("사용자 정보 업데이트 실패:", error);
    return NextResponse.json({ error: "사용자 정보 업데이트 실패" }, { status: 500 });
  }
};
