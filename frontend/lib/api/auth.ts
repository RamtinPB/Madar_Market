let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};

export const getAccessToken = () => accessToken;

export async function login(
	phoneNumber: string,
	password: string,
	otp: string
) {
	const res = await fetch("/api/auth/login", {
		method: "POST",
		credentials: "include",
		body: JSON.stringify({ phoneNumber, password, otp }),
	});

	if (!res.ok) throw new Error("Login failed");

	const data = await res.json();
	setAccessToken(data.accessToken);
	return data.user;
}

export async function logout() {
	await fetch("/api/auth/logout", {
		method: "POST",
		credentials: "include",
	});

	setAccessToken(null);
}
