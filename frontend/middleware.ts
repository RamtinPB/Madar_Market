import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const refreshToken = req.cookies.get("refreshToken")?.value;

	const protectedPaths = ["/admin"];
	const isProtected = protectedPaths.some((p) =>
		req.nextUrl.pathname.startsWith(p)
	);

	if (isProtected && !refreshToken) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};

// this file requires further inquiry
