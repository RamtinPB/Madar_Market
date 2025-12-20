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
