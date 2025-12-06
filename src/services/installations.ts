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

let installationsCache: Installation[] | null = null;
let installationsPromise: Promise<Installation[]> | null = null;

function normalizeFacility(
	data?: FacilityApi | null,
	fallback?: Installation,
): Installation {
	if (!data) {
		return (
			fallback ?? {
				id: `facility-${Math.random().toString(36).slice(2)}`,
				nombre: "",
				tipo: "",
				capacidad: 0,
				direccion: "",
				estado: "Sin estado",
				statusId: null,
			}
		);
	}

	const statusId = data.status_ID ?? null;
	const fallbackId = data.id ?? fallback?.id ?? `facility-${Math.random().toString(36).slice(2)}`;

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

	if (installationsCache) {
		return installationsCache;
	}

	if (installationsPromise) {
		return installationsPromise;
	}

	const request = (async () => {
		const facilities = await apiFetchJson<FacilityApi[]>(
			"/api/Facility/GetAllFacilitiesAsyncFront",
		);

		const normalized = Array.isArray(facilities)
			? facilities.map((facility) => normalizeFacility(facility))
			: [];

		installationsCache = normalized;
		return normalized;
	})();

	installationsPromise = request;

	try {
		return await request;
	} finally {
		installationsPromise = null;
	}
}

export function clearInstallationsCache() {
	installationsCache = null;
	installationsPromise = null;
}

export type InstallationPayload = {
	nombre: string;
	tipo: string;
	capacidad: number;
	direccion: string;
	estadoId?: number | string | null;
	estado?: string;
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

	let normalized = normalizeFacility(facility, {
		id: `facility-${Math.random().toString(36).slice(2)}`,
		nombre: payload.nombre,
		tipo: payload.tipo,
		capacidad: payload.capacidad,
		direccion: payload.direccion,
		estado:
			typeof payload.estadoId === "number" || typeof payload.estadoId === "string"
				? String(payload.estadoId)
				: payload.estado ?? "Sin estado",
		statusId,
	});

	if (installationsCache) {
		installationsCache = [...installationsCache, normalized];
	}

	// Si la API no devuelve un id numérico, refrescamos la lista para obtenerlo.
	if (typeof normalized.id !== "number" || Number.isNaN(normalized.id)) {
		try {
			clearInstallationsCache();
			const fresh = await getInstallations();
			// Buscamos coincidencia por los campos enviados.
			const bestMatch = fresh.find(
				(item) =>
					item.nombre === payload.nombre &&
					item.tipo === payload.tipo &&
					item.capacidad === payload.capacidad &&
					item.direccion === payload.direccion,
			);
			if (bestMatch) {
				normalized = bestMatch;
			}
			installationsCache = fresh;
		} catch (error) {
			console.error("No se pudo refrescar instalaciones tras crear", error);
		}
	}

	return normalized;
}

export async function updateInstallation(
	id: number | string,
	payload: InstallationPayload,
): Promise<Installation> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const statusId = parseStatusId(payload.estadoId);
	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Update requiere un id numérico válido");
	}

	const body: FacilityApi = {
		id: numericId,
		name: payload.nombre,
		type: payload.tipo,
		capacity: payload.capacidad,
		address: payload.direccion,
		status_ID: statusId,
	};

	const facility = await apiFetchJson<FacilityApi>("/api/Facility/UpdateFacilityAsync", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const fallbackNormalized: Installation = {
		id: numericId,
		nombre: payload.nombre,
		tipo: payload.tipo,
		capacidad: payload.capacidad,
		direccion: payload.direccion,
		estado:
			typeof payload.estadoId === "number" || typeof payload.estadoId === "string"
				? String(payload.estadoId)
				: payload.estado ?? "Sin estado",
		statusId: parseStatusId(payload.estadoId),
	};

	const normalized =
		facility && typeof facility === "object"
			? normalizeFacility({ ...facility, id: numericId }, fallbackNormalized)
			: fallbackNormalized;

	if (installationsCache) {
		installationsCache = installationsCache.map((item) =>
			item.id === id ? normalized : item,
		);
	}

	return normalized;
}

export async function deleteInstallation(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Delete requiere un id numérico válido");
	}

	await apiFetchJson(`/api/Facility/DeleteFacilityFront?id=${numericId}`, {
		method: "DELETE",
	});

	if (installationsCache) {
		installationsCache = installationsCache.filter((item) => item.id !== id);
	}
}
