import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "super admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};