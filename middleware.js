// middleware.js (root level of Next.js project)
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  

  // ✅ STEP 1: Define which paths require protection
  const protectedPaths = ["/dashboard"];
  
  // Check if current path is protected
  const isProtected = protectedPaths.some((path) => 
    pathname.startsWith(path)
  );

  // If not protected, allow access immediately
  if (!isProtected) {
    return NextResponse.next();
  }

  // ✅ STEP 2: Get authentication data from cookies
  const token = req.cookies.get("token")?.value;
  const permissionsString = req.cookies.get("permissions")?.value;


  // ✅ STEP 3: Check if user is authenticated
  if (!token) {
    const loginUrl = new URL("/frontEnd/log_in", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ STEP 4: Parse permissions from cookie
  let permissions = [];
  
  try {
    permissions = permissionsString ? JSON.parse(permissionsString) : [];
  } catch (e) {
    console.error("❌ Failed to parse permissions:", e);
    permissions = [];
  }

  // ✅ STEP 5: Check if user has ANY dashboard/admin permission
  // This is flexible - any permission means they can access dashboard
  const hasDashboardPermission = permissions.includes("view dashboard");
  
  // ✅ ALTERNATIVE: Check if user has ANY permission at all
  // This means anyone with any permission can access dashboard
  const hasAnyPermission = permissions.length > 0;

  if (!hasDashboardPermission && !hasAnyPermission) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // ✅ STEP 6: No route-specific checks here!
  // Let the ProtectedRoute components handle page-level permission checks
  // Let the sidebar handle menu visibility
  // Let the Laravel API handle action permissions
  return NextResponse.next();
}

// ✅ Configure which paths to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*"
  ]
};