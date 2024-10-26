import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";
import axios from "axios";

export const POST = async (request: NextRequest, { params }: { params: { columnId: number } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const columnId = params.columnId;

    if (!image) {
      return NextResponse.json({ error: "이미지 파일이 없습니다." }, { status: 400 });
    }

    const response = await apiClient.post(`/columns/${columnId}/card-image`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({ imageUrl: response.data.imageUrl }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("카드 이미지 업로드 실패: ", error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.status });
      }
    }

    return NextResponse.json({ error: "카드 이미지 업로드에 실패했습니다." }, { status: 500 });
  }
};
