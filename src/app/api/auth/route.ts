import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "bienaole";
const COOKIE_NAME = "ai-daipai-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body as { password?: string };

  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
