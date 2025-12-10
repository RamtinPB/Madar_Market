import * as authService from "./auth.service";
import { verifyAccessToken } from "../../utils/jwt";
import { prisma } from "../../utils/prisma";

export const requestOtp = async (ctx: any) => {
	const body = await ctx.body;
	const phoneNumber = body.phoneNumber;
	const purpose = body.purpose || "login"; // could be 'login' or 'signup'
	if (!phoneNumber) {
		ctx.set.status = 400;
		return { error: "Phone number is required" };
	}

	const result = await authService.generateAndStoreOTP(phoneNumber, purpose);
	// In development we return the otp so you can test; remove in prod.
	return { success: true, otp: result.otp };
};

export const signup = async (ctx: any) => {
	const body = await ctx.body;
	const { phoneNumber, password, otp } = body || {};
	if (!phoneNumber || !password || !otp) {
		ctx.set.status = 400;
		return {
			error: "Phone number, password and OTP are required",
		};
	}

	try {
		const created = await authService.signupWithPasswordOtp(
			phoneNumber,
			password,
			otp
		);
		// set refresh token in httpOnly cookie (recommended)
		// Set cookie with SameSite=None to allow cross-origin fetches from the
		// frontend. Set `secure` in production. In development we keep `secure`
		// false to allow localhost HTTP (dev only).
		ctx.cookie.refreshToken.set({
			value: created.refreshToken,
			httpOnly: true,
			sameSite: "none",
			secure: true,
			path: "/",
			maxAge:
				60 *
				60 *
				24 *
				parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d", 10),
		});
		// In development return the refreshToken in the response body as a
		// fallback when cookies might be rejected by the browser. NEVER do
		// this in production.
		if (process.env.NODE_ENV !== "production") {
			return {
				user: created.user,
				accessToken: created.accessToken,
				refreshToken: created.refreshToken,
			};
		}
		return { user: created.user, accessToken: created.accessToken };
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "signup failed" };
	}
};

export const login = async (ctx: any) => {
	const body = await ctx.body;
	const { phoneNumber, password, otp } = body || {};
	if (!phoneNumber || !password || !otp) {
		ctx.set.status = 400;
		return { error: "Phone number, password and OTP are required" };
	}

	try {
		const res = await authService.loginWithPasswordOtp(
			phoneNumber,
			password,
			otp
		);
		ctx.cookie.refreshToken.set({
			value: res.refreshToken,
			httpOnly: true,
			sameSite: "none",
			secure: true,
			path: "/",
			maxAge:
				60 *
				60 *
				24 *
				parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d", 10),
		});
		// Development-only: return refresh token in body to help local dev when
		// SameSite/Secure prevents the cookie from being stored. Do not enable
		// in production.
		if (process.env.NODE_ENV !== "production") {
			return {
				user: res.user,
				accessToken: res.accessToken,
				refreshToken: res.refreshToken,
			};
		}
		return { user: res.user, accessToken: res.accessToken };
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "login failed" };
	}
};

export const refresh = async (ctx: any) => {
	// we expect refresh token in cookie
	let raw = ctx.cookie.refreshToken.value; // cookie already present

	// Allow supplying the refresh token in the request body for Swagger testing
	if (!raw) {
		const body = await ctx.body;
		raw = body?.refreshToken;
	}

	if (!raw) {
		ctx.set.status = 401;
		return { error: "Refresh token is required" };
	}

	try {
		const tokens = await authService.refreshAccessToken(raw);

		ctx.cookie.refreshToken.set({
			value: tokens.refreshToken,
			httpOnly: true,
			sameSite: "none",
			secure: true,
			path: "/",
			maxAge:
				60 *
				60 *
				24 *
				parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d", 10),
		});
		return { accessToken: tokens.accessToken };
	} catch (err: any) {
		ctx.set.status = 401;
		return { error: err.message || "Invalid refresh token" };
	}
};

export const logout = async (ctx: any) => {
	// 1️⃣ Get the access token from Authorization header
	const auth = ctx.request.headers.get("authorization") || "";
	const parts = auth.split(" ");
	let accessToken = null;

	if (parts.length === 2 && parts[0] === "Bearer") {
		accessToken = parts[1];
	}

	// 2️⃣ Get the refresh token from cookie or body
	let refreshToken = ctx.cookie.refreshToken.value; // cookie already present

	// Allow supplying the refresh token in the request body for Swagger testing
	if (!refreshToken) {
		const body = await ctx.body;
		refreshToken = body?.refreshToken;
	}

	// 3️⃣ Revoke both tokens if they exist
	if (accessToken) {
		await authService.revokeAccessToken(accessToken);
	}

	if (refreshToken) {
		await authService.revokeRefreshToken(refreshToken);
	}

	// 4️⃣ Clear the cookie (maxAge 0 = delete) - always clear in development too
	ctx.cookie.refreshToken.set({
		value: "",
		httpOnly: true,
		sameSite: "none",
		secure: true,
		path: "/",
		maxAge: 0, // delete immediately
	});

	return { ok: true };
};

export const me = async (ctx: any) => {
	const auth = ctx.request.headers.get("authorization") || "";
	const parts = auth.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		ctx.set.status = 401;
		return { error: "Unauthorized" };
	}

	const token = parts[1];
	try {
		// Check if access token is revoked
		const isRevoked = await authService.isAccessTokenRevoked(token);
		if (isRevoked) {
			ctx.set.status = 401;
			return { error: "Token revoked" };
		}

		const payload: any = verifyAccessToken(token);
		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
		});
		if (!user) {
			ctx.set.status = 401;
			return { error: "User not found" };
		}
		return {
			user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role },
		};
	} catch (error) {
		ctx.set.status = 401;
		return { error: "Invalid token" };
	}
};
