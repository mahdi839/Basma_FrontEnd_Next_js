// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Define protected paths
  const protectedPaths = ["/dashboard"];
  
  // Check if current path is protected
  const isProtected = protectedPaths.some((path) => 
    pathname.startsWith(path)
  );

  // If not protected, allow access
  if (!isProtected) {
    return NextResponse.next();
  }

  // ✅ Get token and roles from cookies (middleware can only read cookies, not localStorage)
  const token = req.cookies.get("token")?.value;
  const rolesString = req.cookies.get("roles")?.value;

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL("/frontEnd/log_in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Parse roles
  let roles = [];
  try {
    roles = rolesString ? JSON.parse(rolesString) : [];
  } catch (e) {
    roles = [];
  }

  // ✅ Check if user has admin or super-admin role
  const hasAdminAccess = roles.some(role => 
    ["admin", "super-admin"].includes(role)
  );

  // Redirect if not admin
  if (!hasAdminAccess) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next(); // Allow access
}

// ✅ Configure which paths to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ]
};