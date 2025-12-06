import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY_IN || "15m";
const REFRESH_DAYS = parseInt(
	process.env.REFRESH_TOKEN_EXPIRY_DAYS || "30d",
	10
);

export const signAccessToken = (payload: object) => {
	return jwt.sign(payload, ACCESS_SECRET, {
		expiresIn: `${ACCESS_EXP}` as jwt.SignOptions["expiresIn"],
	});
};

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, ACCESS_SECRET);
};

export const signRefreshToken = (payload: object) => {
	return jwt.sign(payload, REFRESH_SECRET, {
		expiresIn: `${REFRESH_DAYS}` as jwt.SignOptions["expiresIn"],
	});
};

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, REFRESH_SECRET);
};
