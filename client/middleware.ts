import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Protect Admin Dashboard
  if (pathname.startsWith("/admindashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/adminlogin", request.url));
    }
  }

  // Protect Employee Dashboard
  if (pathname.startsWith("/employee-dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/employeelogin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admindashboard/:path*", "/employee-dashboard/:path*"],
};
