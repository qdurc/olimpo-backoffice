import { apiFetchJson, isApiConfigured } from "./http";

type FacilityApi = {
	id?: number;
	name?: string;
	type?: string;
	capacity?: number;
	address?: string;
	status_ID?: number | null;
};

export type Installation = {
	id: number | string;
	nombre: string;
	tipo: string;
	capacidad: number;
	direccion: string;
	estado: string;
	statusId: number | null;
};

function normalizeFacility(data: FacilityApi): Installation {
	const statusId = data.status_ID ?? null;
	const fallbackId = data.id ?? `facility-${Math.random().toString(36).slice(2)}`;

	return {
		id: fallbackId,
		nombre: data.name ?? "",
		tipo: data.type ?? "",
		capacidad: data.capacity ?? 0,
		direccion: data.address ?? "",
		estado: statusId !== null ? String(statusId) : "Sin estado",
		statusId,
	};
}

function parseStatusId(statusId?: number | string | null) {
	if (statusId === null || statusId === undefined) return null;
	if (typeof statusId === "number" && !Number.isNaN(statusId)) return statusId;
	const parsed = Number(statusId);
	return Number.isNaN(parsed) ? null : parsed;
}

export async function getInstallations(): Promise<Installation[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const facilities = await apiFetchJson<FacilityApi[]>(
		"/api/Facility/GetAllFacilitiesAsync",
	);

	return Array.isArray(facilities)
		? facilities.map(normalizeFacility)
		: [];
}

export type InstallationPayload = {
	nombre: string;
	tipo: string;
	capacidad: number;
	direccion: string;
	estadoId?: number | string | null;
};

export async function createInstallation(
	payload: InstallationPayload,
): Promise<Installation> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const statusId = parseStatusId(payload.estadoId);

	const body: FacilityApi = {
		name: payload.nombre,
		type: payload.tipo,
		capacity: payload.capacidad,
		address: payload.direccion,
		status_ID: statusId,
	};

	const facility = await apiFetchJson<FacilityApi>(
		"/api/Facility/AddFacilityAsync",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	return normalizeFacility(facility);
}
