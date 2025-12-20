import { prisma } from "../../infrastructure/db/prisma.client";
import { hashPassword, comparePassword } from "../../shared/security/hash";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
	verifyAccessToken,
	parseExpiryToMs,
} from "../../infrastructure/auth/jwt.provider";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const OTP_LENGTH = 4;
const OTP_EXP = parseInt(process.env.OTP_EXPIRE_IN!, 10);
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRE_IN;

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
	const expiresAt = new Date(Date.now() + OTP_EXP * 60 * 1000);
	await prisma.oTP.create({
		// prisma model name: OTP mapped to oTP in JS client sometimes; check your generated client name. If mismatch, use prisma.OTP.create
		data: {
			phoneNumber: phoneNumber,
			codeHash,
			expiresAt,
			userId: user?.id ?? null,
		},
	});

	return { success: true, otp: otp };
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
	const accessToken = signAccessToken({
		userId: newUser.id,
		role: newUser.role,
	});
	const refreshToken = signRefreshToken({ userId: newUser.id });

	// store hashed refresh token
	const refreshHash = await bcrypt.hash(refreshToken, 10);
	const refreshExpiryMs = parseExpiryToMs(REFRESH_EXP!);
	const expiresAt = new Date(Date.now() + refreshExpiryMs);
	console.log("Refresh token DB expiresAt:", expiresAt);
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
	const accessToken = signAccessToken({ userId: user.id, role: user.role });
	const refreshToken = signRefreshToken({ userId: user.id });

	const refreshHash = await bcrypt.hash(refreshToken, 10);
	const refreshExpiryMs = parseExpiryToMs(REFRESH_EXP!);
	const expiresAt = new Date(Date.now() + refreshExpiryMs);
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
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new Error("User not found");

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
			const accessToken = signAccessToken({ userId, role: user.role });
			// Optionally rotate refresh token: issue new refresh token and revoke old one
			const newRefreshToken = signRefreshToken({ userId });
			const newHash = await bcrypt.hash(newRefreshToken, 10);
			const refreshExpiryMs = parseExpiryToMs(REFRESH_EXP!);
			const expiresAt = new Date(Date.now() + refreshExpiryMs);

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

export const revokeAccessToken = async (rawAccessToken: string) => {
	try {
		// Decode the token to get userId and expiration
		const payload: any = verifyAccessToken(rawAccessToken);
		const userId = payload.userId;
		const expiresAt = new Date(payload.exp * 1000); // Convert to Date

		// Use SHA-256 hash for faster lookups
		const tokenHash = crypto
			.createHash("sha256")
			.update(rawAccessToken)
			.digest("hex");

		// Store in revoked tokens table
		await prisma.revokedAccessToken.create({
			data: {
				tokenHash,
				expiresAt,
				userId,
			},
		});
		return true;
	} catch (error) {
		// If token is invalid, we can't revoke it, but that's okay
		return false;
	}
};

export const isAccessTokenRevoked = async (rawAccessToken: string) => {
	try {
		// Hash the token using SHA-256 for consistency
		const tokenHash = crypto
			.createHash("sha256")
			.update(rawAccessToken)
			.digest("hex");

		// Check if it exists in revoked tokens and hasn't expired
		const revoked = await prisma.revokedAccessToken.findFirst({
			where: {
				tokenHash,
				expiresAt: { gte: new Date() },
			},
		});

		return !!revoked;
	} catch (error) {
		// If hashing fails, consider it not revoked
		return false;
	}
};

// Clean up expired revoked tokens periodically
export const cleanupExpiredRevokedTokens = async () => {
	try {
		await prisma.revokedAccessToken.deleteMany({
			where: {
				expiresAt: { lt: new Date() },
			},
		});
	} catch (error) {
		console.error("Failed to cleanup expired revoked tokens:", error);
	}
};
