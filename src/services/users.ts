import { apiFetchJson, isApiConfigured } from "./http";

export type User = {
	id: number | string;
	nombre: string;
	email: string;
	rol: string;
	estado: string;
	personType: string;
	personTypeId?: number | string | null;
	avatar: string;
	rolId?: number | string | null;
	estadoId?: number | string | null;
	identification?: string | null;
	bornDateIso?: string | null;
	gender?: "M" | "F" | string | null;
};

type UserApi = {
	id?: number | string | null;
	userId?: number | string | null;
	name?: string | null;
	email?: string | null;
	rol?: string | null;
	status?: string | null;
	personType?: string | null;
	personTypeID?: number | string | null;
	foto?: string | null;
	avatar?: string | null;
	rolId?: number | string | null;
	roleId?: number | string | null;
	estatusID?: number | string | null;
	statusId?: number | string | null;
	estadoId?: number | string | null;
	cedula?: string | null;
	bornDate?: string | null;
	gender?: string | null;
	identification?: string | null;
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
	estadoId?: number | string | null;
	personTypeId?: number | string | null;
	bornDateIso?: string | null;
	gender?: "M" | "F" | string | null;
};

export type UserCreatePayload = UserUpdatePayload & {
	email: string;
	rolId?: number | string | null;
	estadoId?: number | string | null;
	password: string;
	identification?: string | null;
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

function parseDate(value?: string | null) {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function toDotNetDateTime(value?: string | null) {
	if (!value) return undefined;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return undefined;

	const pad = (n: number, size = 2) => n.toString().padStart(size, "0");
	const ms = date.getMilliseconds();

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(ms, 3)}`;
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

	const personType = user?.personType ?? fallback?.personType ?? "";
	const personTypeId =
		user?.personTypeID ??
		(user?.personType?.toLowerCase?.().trim() === "atleta"
			? 1
			: user?.personType?.toLowerCase?.().trim() === "entrenador"
				? 2
				: null) ??
		(fallback as any)?.personTypeId ??
		null;

	const identification =
		user?.identification ??
		(user as any)?.cedula ??
		(fallback as any)?.identification ??
		null;

	const bornDateIso =
		user?.bornDate ??
		(fallback as any)?.bornDateIso ??
		null;

	const gender =
		user?.gender ??
		(fallback as any)?.gender ??
		null;

	return {
		id,
		nombre,
		email,
		rol,
		estado,
		personType,
		personTypeId,
		avatar,
		rolId,
		estadoId,
		identification,
		bornDateIso,
		gender,
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
	let payload: UserApi[] = [];

	if (Array.isArray(response)) {
		payload = response;
	} else if (response && typeof response === "object" && "data" in response) {
		const data = (response as { data?: UserApi | UserApi[] | null }).data;
		if (Array.isArray(data)) {
			payload = data;
		} else if (data) {
			payload = [data];
		} else {
			payload = [];
		}
	} else if (response) {
		payload = [response as UserApi];
	}

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
		{
			userId: payload.userId,
			name: payload.name,
			email: payload.email,
			personType: fallback?.personType ?? null,
			personTypeID: (fallback as any)?.personTypeId ?? null,
		},
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
	currentUser?: User,
): Promise<User> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const personTypeID = parseNum(payload.personTypeId ?? null);
	const status = parseNum(payload.estadoId ?? null) ?? 0;

	const gender =
		payload.gender === "M" || payload.gender === "F"
			? payload.gender
			: undefined;

	const bornDate = toDotNetDateTime(payload.bornDateIso ?? null);

	const body = {
		userId: requestId,
		name: payload.nombre,
		personTypeID,
		status,
		...(gender ? { gender } : {}),
		...(bornDate ? { bornDate } : {}),
	};

	const response = await apiFetchJson<UserUpdateResponse>("/api/User/UpdateProfileAdmin", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const updated =
		response && typeof response === "object" && "data" in response
			? response.data
			: (response as UserApi | null | undefined);

	const fallbackUser: User = {
		id: requestId,
		nombre: payload.nombre ?? currentUser?.nombre ?? "",
		email: currentUser?.email ?? "",
		rol: currentUser?.rol ?? "Usuario",
		estado:
			currentUser?.estado ??
			(payload.estadoId !== undefined && payload.estadoId !== null
				? String(payload.estadoId)
				: "Activo"),
		personType:
			currentUser?.personType ??
			(personTypeID === 1
				? "Atleta"
				: personTypeID === 2
					? "Entrenador"
					: ""),
		personTypeId: personTypeID ?? currentUser?.personTypeId ?? null,
		avatar:
			currentUser?.avatar ??
			buildAvatar(String(currentUser?.email || currentUser?.nombre || requestId)),
		rolId: currentUser?.rolId ?? null,
		estadoId: payload.estadoId ?? currentUser?.estadoId ?? null,
		identification: currentUser?.identification ?? null,
		bornDateIso: payload.bornDateIso ?? currentUser?.bornDateIso ?? null,
		gender: payload.gender ?? currentUser?.gender ?? null,
	};

	const normalized = normalizeUser(updated, fallbackUser);

	normalized.estadoId = payload.estadoId ?? normalized.estadoId ?? null;
	normalized.personTypeId = payload.personTypeId ?? normalized.personTypeId ?? null;

	return normalized;
}

export async function createUser(payload: UserCreatePayload): Promise<User> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const born = parseDate(payload.bornDateIso ?? null);
	if (!born) {
		throw new Error("Fecha de nacimiento inválida");
	}

	const bornDate = toDotNetDateTime(payload.bornDateIso ?? null);
	if (!bornDate) {
		throw new Error("Fecha de nacimiento inválida");
	}

	const roleId = parseNum(payload.rolId);
	const estatusID = parseNum(payload.estadoId);
	const personTypeID = parseNum(payload.personTypeId);

	const gender =
		payload.gender === "M" || payload.gender === "F"
			? payload.gender
			: undefined;

	const body = {
		id: 0,
		name: payload.nombre,
		email: payload.email,
		password: payload.password,
		roleId: roleId ?? 0,
		estatusID: estatusID ?? 0,
		personTypeID: personTypeID ?? 0,
		bornDate,
		gender,
		identification: payload.identification ?? "",
	};

	const response = await apiFetchJson<UserUpdateResponse>("/api/Auth/RegisterAdmin", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const created =
		response && typeof response === "object" && "data" in response
			? response.data
			: (response as UserApi | null | undefined);

	const fallbackUser: User = {
		id: created?.id ?? created?.userId ?? `user-${Math.random().toString(36).slice(2)}`,
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
		avatar: buildAvatar(String(payload.email || payload.nombre)),
		rolId: payload.rolId ?? null,
		estadoId: payload.estadoId ?? null,
		personType:
			parseNum(payload.personTypeId) === 1
				? "Atleta"
				: parseNum(payload.personTypeId) === 2
					? "Entrenador"
					: "",
		personTypeId: parseNum(payload.personTypeId),
		identification: payload.identification ?? null,
		bornDateIso: payload.bornDateIso ?? null,
		gender: payload.gender ?? null,
	};

	const normalized = normalizeUser(created, fallbackUser);
	normalized.rolId = payload.rolId ?? normalized.rolId ?? null;
	normalized.estadoId = payload.estadoId ?? normalized.estadoId ?? null;

	return normalized;
}
