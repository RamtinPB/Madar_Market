import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/admin"];

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();

	// Check if path is protected
	const isProtected = PROTECTED_PATHS.some((path) =>
		req.nextUrl.pathname.startsWith(path),
	);

	if (!isProtected) return NextResponse.next();

	try {
		// Call internal API to check/refresh token
		const res = await fetch(`${req.nextUrl.origin}/auth/refresh`, {
			headers: {
				cookie: req.headers.get("cookie") || "", // send cookies along
			},
		});

		if (res.ok) return NextResponse.next(); // valid access or refreshed

		// If check fails → redirect
		url.pathname = "/";
		return NextResponse.redirect(url);
	} catch (err) {
		url.pathname = "/";
		return NextResponse.redirect(url);
	}
}

export const config = {
	matcher: ["/admin/:path*"],
};
