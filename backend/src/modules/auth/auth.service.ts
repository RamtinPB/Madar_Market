import { prisma } from "../../../src/utils/prisma";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "../../utils/jwt";
import bcrypt from "bcryptjs";

const OTP_LENGTH = 4;
const OTP_EXP_MIN = parseInt(process.env.OTP_EXPIRY_MINUTES || "3", 10);

const generateNumericOtp = (length: number) => {
	// ensures leading zeros allowed
	return String(Math.floor(Math.random() * Math.pow(10, length))).padStart(
		length,
		"0"
	);
};

export const generateAndStoreOTP = async (
	phoneNumber: string,
	purpose: "signup" | "login"
) => {
	// Find or create a placeholder user to relate OTPs to later
	const user = await prisma.user.findUnique({ where: { phoneNumber } });
	if (purpose === "login" && !user) {
		throw new Error("User not found, redirect to signup");
	}

	if (purpose === "signup" && user) {
		throw new Error("User already exists, redirect to login");
	}

	const otp = generateNumericOtp(OTP_LENGTH);
	const codeHash = await bcrypt.hash(otp, 10);
	const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);
	await prisma.oTP.create({
		// prisma model name: OTP mapped to oTP in JS client sometimes; check your generated client name. If mismatch, use prisma.OTP.create
		data: {
			phoneNumber: phoneNumber,
			codeHash,
			expiresAt,
			userId: user?.id ?? null,
		},
	});

	// In production: send via SMS. In development you may return the value.
	return { success: true, otp: otp }; // remove otp in production
};

export const validateOtpAndConsume = async (
	phoneNumber: string,
	otpPlain: string
) => {
	const otpRow = await prisma.oTP.findFirst({
		where: {
			phoneNumber: phoneNumber,
			consumed: false,
			expiresAt: { gte: new Date() },
		},
		orderBy: { createdAt: "desc" },
	});
	if (!otpRow) throw new Error("invalid or expired OTP");

	const match = await bcrypt.compare(otpPlain, otpRow.codeHash);
	if (!match) {
		throw new Error("invalid OTP");
	}

	// consume
	await prisma.oTP.update({
		where: { id: otpRow.id },
		data: { consumed: true },
	});

	return true;
};

export const signupWithPasswordOtp = async (
	phoneNumber: string,
	password: string,
	otp: string
) => {
	// ensure user does not already exist
	const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
	if (existingUser) throw new Error("User already exists");

	// validate otp and consume
	await validateOtpAndConsume(phoneNumber, otp);

	// Hash provided password and update user
	const passwordHash = await hashPassword(password);

	const newUser = await prisma.user.create({
		data: { phoneNumber, passwordHash },
	});

	// issue tokens
	const accessToken = signAccessToken({ userId: newUser.id });
	const refreshToken = signRefreshToken({ userId: newUser.id });

	// store hashed refresh token
	const refreshHash = await bcrypt.hash(refreshToken, 10);
	const expiresAt = new Date(
		Date.now() +
			parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10) *
				24 *
				60 *
				60 *
				1000
	);
	await prisma.refreshToken.create({
		data: {
			tokenHash: refreshHash,
			expiresAt,
			userId: newUser.id,
		},
	});

	return {
		user: {
			id: newUser.id,
			phoneNumber: newUser.phoneNumber,
			role: newUser.role,
		},
		accessToken,
		refreshToken,
	};
};

export const loginWithPasswordOtp = async (
	phoneNumber: string,
	password: string,
	otp: string
) => {
	const user = await prisma.user.findUnique({ where: { phoneNumber } });
	if (!user) throw new Error("User not found");

	// verify password
	const okPass = await comparePassword(password, user.passwordHash);
	if (!okPass) throw new Error("Invalid password");

	// validate otp and consume
	await validateOtpAndConsume(user.phoneNumber, otp);

	//issue tokens
	const accessToken = signAccessToken({ userId: user.id });
	const refreshToken = signRefreshToken({ userId: user.id });

	const refreshHash = await bcrypt.hash(refreshToken, 10);
	const expiresAt = new Date(
		Date.now() +
			parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10) *
				24 *
				60 *
				60 *
				1000
	);
	await prisma.refreshToken.create({
		data: {
			tokenHash: refreshHash,
			expiresAt,
			userId: user.id,
		},
	});

	return {
		user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role },
		accessToken,
		refreshToken,
	};
};

export const refreshAccessToken = async (refreshToken: string) => {
	// verify token signature first
	let payload: any;
	try {
		payload = verifyRefreshToken(refreshToken) as any;
	} catch (err) {
		throw new Error("Invalid refresh token");
	}

	const userId = payload?.userId;
	// Find stored refresh tokens for this user that are not revoked and not expired
	const tokens = await prisma.refreshToken.findMany({
		where: { userId, revoked: false, expiresAt: { gte: new Date() } },
		orderBy: { createdAt: "desc" },
	});

	// Compare the raw token with hashed stored token(s)
	for (const t of tokens) {
		const match = await bcrypt.compare(refreshToken, t.tokenHash);
		if (match) {
			// valid refresh token -> issue new access token (and optionally refresh rotation)
			const accessToken = signAccessToken({ userId });
			// Optionally rotate refresh token: issue new refresh token and revoke old one
			const newRefreshToken = signRefreshToken({ userId });
			const newHash = await bcrypt.hash(newRefreshToken, 10);
			const expiresAt = new Date(
				Date.now() +
					parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10) *
						24 *
						60 *
						60 *
						1000
			);

			// revoke old
			await prisma.refreshToken.update({
				where: { id: t.id },
				data: { revoked: true },
			});

			// store new
			await prisma.refreshToken.create({
				data: {
					tokenHash: newHash,
					expiresAt,
					userId,
				},
			});
			return { accessToken, refreshToken: newRefreshToken };
		}
	}
	throw new Error("Refresh token not found");
};

export const revokeRefreshToken = async (rawRefreshToken: string) => {
	// find and revoke a refresh token (useful for logout)
	const tokens = await prisma.refreshToken.findMany({
		where: { revoked: false },
	});

	for (const t of tokens) {
		const match = await bcrypt.compare(rawRefreshToken, t.tokenHash);
		if (match) {
			await prisma.refreshToken.update({
				where: { id: t.id },
				data: { revoked: true },
			});
			return true;
		}
	}
	return false;
};
