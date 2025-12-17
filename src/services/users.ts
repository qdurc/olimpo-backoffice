import { apiFetchJson, isApiConfigured } from "./http";

export type User = {
	id: number | string;
	nombre: string;
	email: string;
	rol: string;
	estado: string;
	avatar: string;
	rolId?: number | string | null;
	estadoId?: number | string | null;
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
	rolId?: number | string | null;
	roleId?: number | string | null;
	estatusID?: number | string | null;
	statusId?: number | string | null;
	estadoId?: number | string | null;
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

type RoleApi = {
	id?: number | string | null;
	name?: string | null;
};

type StatusApi = {
	id?: number | string | null;
	estatusID?: number | string | null;
	entidadID?: number | string | null;
	descripcion?: string | null;
};

type UserEditApi = {
	userId?: number | string | null;
	name?: string | null;
	email?: string | null;
	rol?: RoleApi[] | null;
	status?: StatusApi[] | null;
};

type UserEditResponse =
	| UserEditApi
	| {
			data?: UserEditApi | null;
			errors?: unknown[];
			success?: boolean;
			message?: string;
	  };

export type UserRoleOption = {
	id: number | string;
	label: string;
};

export type UserStatusOption = {
	id: number | string;
	label: string;
	estatusId?: number | string | null;
	entidadId?: number | string | null;
};

export type UserEditView = {
	user: User;
	roles: UserRoleOption[];
	statuses: UserStatusOption[];
};

export type UserUpdatePayload = {
	nombre: string;
	email: string;
	rolId?: number | string | null;
	estadoId?: number | string | null;
};

function buildAvatar(seed: string): string {
	const safeSeed = encodeURIComponent(seed || Math.random().toString(36).slice(2));
	return `https://i.pravatar.cc/96?u=${safeSeed}`;
}

function parseNum(value: number | string | null | undefined) {
	if (value === null || value === undefined || value === "") return null;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
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
	const rolId = user?.rolId ?? user?.roleId ?? fallback?.rolId ?? null;
	const estadoId =
		user?.estatusID ?? user?.statusId ?? user?.estadoId ?? fallback?.estadoId ?? null;

	const avatar =
		user?.foto ?? user?.avatar ?? fallback?.avatar ?? buildAvatar(String(email || nombre || id));

	return {
		id,
		nombre,
		email,
		rol,
		estado,
		avatar,
		rolId,
		estadoId,
	};
}

function normalizeRoleOptions(roles?: RoleApi[] | null): UserRoleOption[] {
	if (!roles?.length) return [];
	return roles
		.map((role) => {
			const id =
				role?.id ??
				role?.name ??
				`rol-${Math.random().toString(36).slice(2)}`;
			const label =
				role?.name ??
				(role?.id !== undefined && role?.id !== null ? String(role.id) : "");
			return { id, label };
		})
		.filter((role) => role.label !== "");
}

function normalizeStatusOptions(statuses?: StatusApi[] | null): UserStatusOption[] {
	if (!statuses?.length) return [];
	return statuses
		.map((status) => {
			const id =
				status?.estatusID ??
				status?.id ??
				`status-${Math.random().toString(36).slice(2)}`;
			const label =
				status?.descripcion ??
				(status?.estatusID !== undefined && status?.estatusID !== null
					? String(status.estatusID)
					: status?.id !== undefined && status?.id !== null
						? String(status.id)
						: "");
			return {
				id,
				label,
				estatusId: status?.estatusID ?? null,
				entidadId: status?.entidadID ?? null,
			};
		})
		.filter((status) => status.label !== "");
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

export async function getUserEdit(
	id: number | string,
	fallback?: User,
): Promise<UserEditView> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const response = await apiFetchJson<UserEditResponse>(
		`/api/User/GetUserEdit/${requestId}`,
	);

	const payload =
		response && typeof response === "object" && "data" in response
			? response.data
			: (response as UserEditApi | null | undefined);

	if (!payload) {
		throw new Error("No se encontraron datos para editar el usuario.");
	}

	const user = normalizeUser(
		{ userId: payload.userId, name: payload.name, email: payload.email },
		fallback,
	);

	return {
		user,
		roles: normalizeRoleOptions(payload.rol),
		statuses: normalizeStatusOptions(payload.status),
	};
}

type UserUpdateResponse =
	| UserApi
	| {
			data?: UserApi | null;
			errors?: unknown[];
			success?: boolean;
			message?: string;
	  };

export async function updateUser(
	id: number | string,
	payload: UserUpdatePayload,
): Promise<User> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const body = {
		userId: requestId,
		name: payload.nombre,
		email: payload.email,
		rolId: parseNum(payload.rolId),
		estatusID: parseNum(payload.estadoId),
	};

	const response = await apiFetchJson<UserUpdateResponse>("/api/User/UpdateUser", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const updated =
		response && typeof response === "object" && "data" in response
			? response.data
			: (response as UserApi | null | undefined);

	const fallbackUser: User = {
		id: requestId,
		nombre: payload.nombre,
		email: payload.email,
		rol:
			payload.rolId !== undefined && payload.rolId !== null
				? String(payload.rolId)
				: "Usuario",
		estado:
			payload.estadoId !== undefined && payload.estadoId !== null
				? String(payload.estadoId)
				: "Activo",
		avatar: buildAvatar(String(payload.email || payload.nombre || requestId)),
		rolId: payload.rolId ?? null,
		estadoId: payload.estadoId ?? null,
	};

	const normalized = normalizeUser(updated, fallbackUser);
	normalized.rolId = payload.rolId ?? normalized.rolId ?? null;
	normalized.estadoId = payload.estadoId ?? normalized.estadoId ?? null;

	return normalized;
}
