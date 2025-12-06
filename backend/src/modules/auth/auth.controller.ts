import * as authService from "./auth.service";

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
		ctx.cookie.refreshToken.set({
			value: created.refreshToken,
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge:
				60 *
				60 *
				24 *
				parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d", 10),
		});
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
			sameSite: "lax",
			path: "/",
			maxAge:
				60 *
				60 *
				24 *
				parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d", 10),
		});
		return { user: res.user, accessToken: res.accessToken };
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "login failed" };
	}
};

export const refresh = async (ctx: any) => {
	// we expect refresh token in cookie or body
	const raw = ctx.cookie.refreshToken.value; // cookie already present
	// (await ctx.body)?.refreshToken; // fallback to JSON body -- INSECURE
	if (!raw) {
		ctx.set.status = 401;
		return { error: "Refresh token is required" };
	}

	try {
		const tokens = await authService.refreshAccessToken(raw);

		ctx.cookie.refreshToken.set({
			value: tokens.refreshToken,
			httpOnly: true,
			sameSite: "lax",
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
	// 1️⃣ Get the refresh token
	const raw = ctx.cookie.refreshToken.value; // cookie already present
	// (await ctx.body)?.refreshToken; // fallback to JSON body -- INSECURE
	// 2️⃣ If there is nothing, just answer OK
	if (!raw) return { ok: true };
	// 3️⃣ Invalidate it in your auth service
	await authService.revokeRefreshToken(raw);
	// 4️⃣ Clear the cookie (maxAge 0 = delete)
	ctx.cookie.refreshToken.set({
		value: "",
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 0, // delete immediately
	});
	return { ok: true };
};
