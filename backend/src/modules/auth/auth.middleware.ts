import { verifyAccessToken } from "../../utils/jwt";

export const requireAuth = async (ctx: any) => {
	const auth = ctx.request.headers.get("authorization") || "";
	const parts = auth.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		ctx.set.status = 401;
		return { error: "Unauthorized" };
	}

	const token = parts[1];
	try {
		const payload: any = verifyAccessToken(token);
		// attach user info to context
		ctx.user = { id: payload.userId, role: payload.role };
	} catch (error) {
		ctx.set.status = 401;
		return { error: "Invalid token" };
	}
};

export const requireRole = (role: "SUPER_ADMIN" | "USER") => {
	return async (ctx: any) => {
		if (!ctx.user) {
			ctx.set.status = 401;
			return { error: "Unauthorized" };
		}
		if (ctx.user.role !== role) {
			ctx.set.status = 403;
			return { error: "Forbidden" };
		}
	};
};
