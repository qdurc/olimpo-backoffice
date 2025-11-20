const rawApiUrl = import.meta.env.VITE_API_URL ?? "";
const normalizedBase =
	rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const apiBaseUrl = normalizedBase;
export const isApiConfigured = Boolean(normalizedBase);

type Json = Record<string, unknown> | Array<unknown> | null;

export async function apiFetchJson<T = Json>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const headers =
		options.body !== undefined
			? { "Content-Type": "application/json", ...options.headers }
			: { ...options.headers };

	const response = await fetch(`${apiBaseUrl}${path}`, {
		headers,
		...options,
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(
			message || `Request failed with status ${response.status}`,
		);
	}

	if (response.status === 204) {
		return null as T;
	}

	return (await response.json()) as T;
}
