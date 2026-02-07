export interface User {
	id: string;
	phoneNumber: string;
	role: "USER" | "SUB_ADMIN" | "SUPER_ADMIN";
	createdAt: string;
	updatedAt: string;
}
