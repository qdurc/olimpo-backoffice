import { apiFetchJson, isApiConfigured } from "./http";

export type User = {
	id: number | string;
	nombre: string;
	email: string;
	rol: string;
	estado: string;
	avatar: string;
};

type UserApi = {
	id?: number | string | null;
	userId?: number | string | null;
	name?: string | null;
	email?: string | null;
	rol?: string | null;
	status?: string | null;
	foto?: string | null;
	avatar?: string | null;
};

type UsersResponse =
	| UserApi[]
	| UserApi
	| {
			data?: UserApi | UserApi[] | null;
			errors?: unknown[];
			success?: boolean;
			message?: string;
	  };

function buildAvatar(seed: string): string {
	const safeSeed = encodeURIComponent(seed || Math.random().toString(36).slice(2));
	return `https://i.pravatar.cc/96?u=${safeSeed}`;
}

function normalizeUser(user: UserApi | null | undefined, fallback?: User): User {
	const id =
		(typeof user?.id === "number" && Number.isFinite(user.id)) ||
		typeof user?.id === "string"
			? user.id
			: typeof user?.userId === "number" && Number.isFinite(user.userId)
				? user.userId
				: typeof user?.userId === "string"
					? user.userId
					: fallback?.id ?? `user-${Math.random().toString(36).slice(2)}`;

	const nombre = user?.name ?? fallback?.nombre ?? "";

	const email = user?.email ?? fallback?.email ?? "";
	const rol = user?.rol ?? fallback?.rol ?? "Usuario";
	const estado = user?.status ?? fallback?.estado ?? "Activo";

	const avatar =
		user?.foto ?? user?.avatar ?? fallback?.avatar ?? buildAvatar(String(email || nombre || id));

	return {
		id,
		nombre,
		email,
		rol,
		estado,
		avatar,
	};
}

export async function getUsers(): Promise<User[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const response = await apiFetchJson<UsersResponse>("/api/User/GetAllUsersIndex");
	const payload = Array.isArray(response)
		? response
		: Array.isArray(response?.data)
			? response.data
			: response?.data
				? [response.data]
				: [];

	if (!payload.length) {
		throw new Error("No se encontraron usuarios (respuesta vacía)");
	}

	return payload.map((item) => normalizeUser(item));
}
