import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isProtectedRoute = (request: NextRequest) => {
  return request.nextUrl.pathname.startsWith("/dashboard"); // change this to your protected route
};

export const authMiddleware = async (request: NextRequest) => {
  const response = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const session = await response.json();

  if (isProtectedRoute(request) && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (request.nextUrl.pathname === "/" && session) ||
    (request.nextUrl.pathname === "/signup" && session)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const middleware = (request: NextRequest) => {
  return authMiddleware(request);
};
