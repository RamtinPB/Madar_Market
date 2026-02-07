import { create } from "zustand";

enum RoleTypes {
	USER,
	SUB_ADMIN,
	SUPER_ADMIN,
}

interface AuthState {
	user: any | null;
	userRole: RoleTypes | null;
	accessToken: string | null;

	setUser: (user: any | null) => void;
	setUserRole: (userRole: RoleTypes | null) => void;
	setAccessToken: (token: string | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	userRole: null,
	accessToken: null,

	setUser: (user) => set({ user }),
	setUserRole: (userRole) => set({ userRole }),
	setAccessToken: (token) => set({ accessToken: token }),

	logout: () => set({ user: null, userRole: null, accessToken: null }),
}));
