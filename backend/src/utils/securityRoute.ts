export function secureRoute(detail: any = {}) {
	return {
		detail: {
			security: [{ bearerAuth: [] }],
			...detail,
		},
	};
}
