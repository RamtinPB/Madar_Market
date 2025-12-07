let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const getAccessToken = () => accessToken;

export async function requestOtp(phoneNumber: string, purpose: string) {
	const response = await fetch(`${API_BASE}/auth/request-otp`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ phoneNumber, purpose }),
	});
	if (!response.ok) throw new Error("Failed to request OTP");
	return response.json();
}

export async function login(
	phoneNumber: string,
	password: string,
	otp: string
) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ phoneNumber, password, otp }),
	});

	if (!res.ok) throw new Error("Login failed");

	const data = await res.json();
	setAccessToken(data.accessToken);
	sessionStorage.setItem("accessToken", data.accessToken);
	return data;
}

export async function signup(
	phoneNumber: string,
	password: string,
	otp: string
) {
	const res = await fetch(`${API_BASE}/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ phoneNumber, password, otp }),
	});

	if (!res.ok) throw new Error("signup failed");

	const data = await res.json();
	setAccessToken(data.accessToken);
	sessionStorage.setItem("accessToken", data.accessToken);
	return data;
}

export async function logout() {
	await fetch(`${API_BASE}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});

	setAccessToken(null);
	sessionStorage.removeItem("accessToken");
}
