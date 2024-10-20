import { NextRequest, NextResponse } from "next/server";
import config from "@/constants/config";
import { ChangePassword } from "@/zodSchema/authSchema";
import { apiClient } from "../../apiClient";

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const changePassword: ChangePassword = await request.json();
    await apiClient.put(`/${config.TEAM_ID}/auth/password`, changePassword);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Password change failed" }, { status: 500 });
  }
}
