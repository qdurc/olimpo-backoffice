import { apiFetchJson, isApiConfigured } from "./http";

export type Manager = {
	id: number | string;
	nombreCompleto: string;
	fechaNacimiento: string; // ISO o texto libre según API
	cedula: string;
	status?: number | null;
};

export type ManagerPayload = {
	nombreCompleto: string;
	fechaNacimiento: string;
	cedula: string;
	status?: number | null;
};

type SupervisorApi = {
	id?: number | string | null;
	fullName?: string | null;
	cedula?: string | null;
	bornDate?: string | null;
	born_Date?: string | null;
	birthDate?: string | null;
	dateOfBirth?: string | null;
	fechaNacimiento?: string | null;
	fecha_nacimiento?: string | null;
	status?: number | null;
};

type SupervisorResponse =
	| SupervisorApi[]
	| SupervisorApi
	| {
			data?: SupervisorApi[] | SupervisorApi | null;
			errors?: unknown[];
			success?: boolean;
			message?: string;
	  };

function extractSupervisorArray(response: SupervisorResponse) {
	if (Array.isArray(response)) return response;

	const data = (response as any)?.data;
	if (Array.isArray(data)) return data;

	if (data && typeof data === "object") {
		if (Array.isArray(data.data)) return data.data;
		if (Array.isArray(data.$values)) return data.$values;
	}

	if (Array.isArray((response as any)?.$values)) return (response as any).$values;

	return [];
}

function extractSupervisorSingle(response: SupervisorResponse) {
	if (Array.isArray(response)) return response[0];

	const data = (response as any)?.data;
	if (Array.isArray(data)) return data[0];

	if (data && typeof data === "object") {
		if (Array.isArray(data.data)) return data.data[0];
		if (Array.isArray(data.$values)) return data.$values[0];
		if (data.data) return data.data;
		return data;
	}

	if (Array.isArray((response as any)?.$values)) return (response as any).$values[0];

	return response;
}

function resolveBornDate(data: Partial<Manager> | SupervisorApi | null | undefined) {
	const raw = data as SupervisorApi | null | undefined;
	return (
		raw?.bornDate ??
		raw?.born_Date ??
		raw?.birthDate ??
		raw?.dateOfBirth ??
		raw?.fechaNacimiento ??
		raw?.fecha_nacimiento ??
		data?.fechaNacimiento ??
		""
	);
}

function normalizeDateString(value?: string | null) {
	if (!value) return "";
	const date = new Date(value);
	if (!Number.isNaN(date.getTime())) {
		return date.toISOString().slice(0, 10); // YYYY-MM-DD
	}
	// Si no parsea como Date, intenta extraer YYYY-MM-DD al inicio del string.
	if (typeof value === "string") {
		const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
		if (match) return match[1];
	}
	return value;
}

function normalizeManager(data: Partial<Manager> | SupervisorApi | null | undefined): Manager {
	const rawFecha = resolveBornDate(data);
	const fechaIso = normalizeDateString(rawFecha);
	return {
		id:
			(data as SupervisorApi | undefined)?.id ??
			data?.id ??
			`manager-${Math.random().toString(36).slice(2)}`,
		nombreCompleto:
			(data as SupervisorApi | undefined)?.fullName ?? data?.nombreCompleto ?? "",
		fechaNacimiento: fechaIso,
		cedula: (data as SupervisorApi | undefined)?.cedula ?? data?.cedula ?? "",
		status: (data as SupervisorApi | undefined)?.status ?? data?.status ?? null,
	};
}

/**
 * Placeholder de servicio para encargados.
 * Integra aquí tus llamadas reales cuando el endpoint esté disponible.
 */
export async function getManagers(): Promise<Manager[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const response = await apiFetchJson<SupervisorResponse>(
		"/api/Supervisor/GetAllSupervisorsFront",
	);

	const payload = extractSupervisorArray(response);
	console.log("Managers payload", payload);

	return payload.map((item) => normalizeManager(item));
}

export async function createManager(payload: ManagerPayload): Promise<Manager> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const body: SupervisorApi = {
		fullName: payload.nombreCompleto,
		cedula: payload.cedula,
		bornDate: payload.fechaNacimiento,
		status: payload.status ?? 1,
	};

	const response = await apiFetchJson<SupervisorResponse>(
		"/api/Supervisor/CreateSupervisor",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const created = extractSupervisorSingle(response);

	return normalizeManager({
		...created,
		fullName: body.fullName,
		cedula: body.cedula,
		bornDate: body.bornDate,
		status: body.status,
	});
}

export async function updateManager(
	id: number | string,
	payload: ManagerPayload,
): Promise<Manager> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const body: SupervisorApi = {
		id: requestId,
		fullName: payload.nombreCompleto,
		cedula: payload.cedula,
		bornDate: payload.fechaNacimiento,
		status: payload.status ?? 1,
	};

	const response = await apiFetchJson<SupervisorResponse>(
		"/api/Supervisor/UpdateSupervisor",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const updated = extractSupervisorSingle(response);

	return normalizeManager({
		...updated,
		id: requestId,
		fullName: body.fullName,
		cedula: body.cedula,
		bornDate: body.bornDate,
		status: body.status,
	});
}

export async function deleteManager(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	await apiFetchJson<void>(`/api/Supervisor/DeleteSupervisor/${requestId}`, {
		method: "DELETE",
	});
}
