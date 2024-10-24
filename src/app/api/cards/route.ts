import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "인증 토큰이 없습니다." }, { status: 401 });
    }

    const body = await request.json();
    const { assigneeUserId, columnId, dashboardId, title, description, dueDate, tags, imageUrl } = body;

    return NextResponse.json({ message: "카드 생성 성공!", data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "카드 생성 실패", error }, { status: 500 });
  }
};
