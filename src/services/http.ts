import { getSession } from "./session";

const devApiUrl = import.meta.env.VITE_DEV_API_URL ?? "";
const prodApiUrl = import.meta.env.VITE_API_URL ?? "";
const useDevProxy = import.meta.env.DEV && !devApiUrl;

// When using the dev proxy we keep the base empty so requests go through Vite.
const rawApiUrl = useDevProxy ? "" : devApiUrl || prodApiUrl;
const normalizedBase =
	rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const apiBaseUrl = normalizedBase;
export const isApiConfigured = useDevProxy || Boolean(normalizedBase);

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

	const session = getSession();
	const authHeaders = session?.token
		? {
				Authorization: `Bearer ${session.token}`,
		  }
		: {};

	const response = await fetch(`${apiBaseUrl}${path}`, {
		headers: { ...authHeaders, ...headers },
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

	const contentType = response.headers.get("content-type") || "";

	// Prefer JSON when the server declares it; fall back to text/empty body to avoid
	// SyntaxError when some endpoints return no content.
	if (contentType.includes("application/json")) {
		return (await response.json()) as T;
	}

	const text = await response.text();
	if (!text) {
		return null as T;
	}

	try {
		return JSON.parse(text) as T;
	} catch {
		// If it's not JSON, return the raw text as a best-effort value.
		return text as unknown as T;
	}
}
