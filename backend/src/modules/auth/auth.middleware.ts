import { verifyAccessToken } from "../../utils/jwt";

export const requireAuth = (ctx: any, next: any) => {
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
		ctx.user = { id: payload.id, role: payload.role };
		return next();
	} catch (error) {
		ctx.set.status = 401;
		return { error: "Invalid token" };
	}
};
