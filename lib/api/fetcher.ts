import { getAccessToken, setAccessToken } from "./auth";

export default async function apiFetch(url: string, options: any = {}) {
	const token = getAccessToken();

	const res = await fetch(url, {
		...options,
		headers: {
			...(options.headers || {}),
			authorization: token ? `Bearer ${token}` : "",
			"content-type": "application/json",
		},
		credentials: "include", // send cookies -- refresh cookie importantly
	});

	if (res.status !== 401) return res;

	// refresh access token
	const newToken = await refreshAccessToken();
	if (!newToken) throw new Error("Unauthorized");

	// retry original request with new token.\
	const retryRes = await fetch(url, {
		...options,
		headers: {
			...(options.headers || {}),
			authorization: `Bearer ${newToken}`,
		},
		credentials: "include",
	});

	return retryRes;
}

async function refreshAccessToken() {
	const res = await fetch("/api/auth/refresh", {
		method: "POST",
		credentials: "include",
	});

	if (!res.ok) return null;

	const data = await res.json();
	setAccessToken(data.accessToken);
	return data.accessToken;
}
