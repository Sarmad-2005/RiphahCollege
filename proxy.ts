import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl
  const isAuthenticated = !!session?.user
  const role = (session?.user as any)?.role as string | undefined

  // ── Admin login page: redirect if already signed in ──────────────────────
  if (pathname === "/admin" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  // ── Teacher login page: redirect if already signed in ─────────────────────
  if (pathname === "/teacher" && isAuthenticated) {
    const dest = role === "TEACHER" ? "/teacher/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  // ── Admin dashboard: ADMIN only ───────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) return NextResponse.redirect(new URL("/admin", req.nextUrl))
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/teacher/dashboard", req.nextUrl))
  }

  // ── Teacher dashboard: TEACHER only ──────────────────────────────────────
  if (pathname.startsWith("/teacher/dashboard")) {
    if (!isAuthenticated) return NextResponse.redirect(new URL("/teacher", req.nextUrl))
    if (role !== "TEACHER") return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // NOTE: api/upload is excluded so the middleware doesn't truncate large file
  // uploads to its 10MB body limit (which corrupts the multipart body and makes
  // formData() fail). Those routes enforce their own auth. api/auth is excluded
  // for NextAuth's own endpoints.
  matcher: [
    "/((?!api/auth|api/upload|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)).*)",
  ],
}
