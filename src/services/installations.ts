import { apiFetchJson, isApiConfigured } from "./http";

/** Tipo de la API */
type FacilityApi = {
	id?: number;
	name?: string;
	type?: string;
	capacity?: number;
	address?: string;
	status?: string | number | null;  // GET devuelve string
	status_ID?: number | null;         // POST/UPDATE usa número
};

/** Tipo interno */
export type Installation = {
	id: number | string;
	nombre: string;
	tipo: string;
	capacidad: number;
	direccion: string;
	estado: string;         // siempre string
	statusId: number | null; // solo para enviar
};

let installationsCache: Installation[] | null = null;
let installationsPromise: Promise<Installation[]> | null = null;

/** Normalizador */
function normalizeFacility(
	data?: FacilityApi | null,
	fallback?: Installation
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

	/** 1) ESTADO REAL */
	let estado = fallback?.estado ?? "Sin estado";

	// Si el back devuelve string (GET)
	if (typeof data.status === "string") {
		estado = data.status;
	}

	/** 2) STATUS ID */
	let statusId = fallback?.statusId ?? null;

	if (typeof data.status === "number") {
		statusId = data.status;
	}

	if (typeof data.status_ID === "number") {
		statusId = data.status_ID;
	}

	return {
		id:
			data.id ??
			fallback?.id ??
			`facility-${Math.random().toString(36).slice(2)}`,

		nombre: data.name ?? fallback?.nombre ?? "",
		tipo: data.type ?? fallback?.tipo ?? "",
		capacidad: data.capacity ?? fallback?.capacidad ?? 0,
		direccion: data.address ?? fallback?.direccion ?? "",
		estado,
		statusId,
	};
}

function parseStatusId(value?: number | string | null) {
	if (value === null || value === undefined) return null;
	const n = Number(value);
	return Number.isNaN(n) ? null : n;
}

/** GET ALL */
export async function getInstallations(): Promise<Installation[]> {
	if (!isApiConfigured)
		throw new Error("API base URL is not configured");

	if (installationsCache) return installationsCache;
	if (installationsPromise) return installationsPromise;

	const request = (async () => {
		const response = await apiFetchJson<FacilityApiResponse | FacilityApi[]>(
			"/api/Facility/GetAllFacilitiesAsyncFront"
		);

		const facilities = Array.isArray(response)
			? response
			: Array.isArray(response?.data)
				? response.data
				: [];

		const normalized = facilities.map((f) => normalizeFacility(f));

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

/** CREATE */
export async function createInstallation(
	payload: InstallationPayload
): Promise<Installation> {
	if (!isApiConfigured) throw new Error("API base URL is not configured");

	const statusId = parseStatusId(payload.estadoId);

	const body: FacilityApi = {
		name: payload.nombre,
		type: payload.tipo,
		capacity: payload.capacidad,
		address: payload.direccion,
		status_ID: statusId,
	};

	const raw = await apiFetchJson<FacilitySingleResponse | FacilityApi>(
		"/api/Facility/AddFacilityAsync",
		{
			method: "POST",
			body: JSON.stringify(body),
		}
	);

	const facilityData =
		typeof raw === "object" && raw !== null && "data" in raw ? raw.data : raw;

	// ⛔ El POST NO devuelve status string → usamos fallback del payload
	const fallback: Installation = {
		id: `facility-${Math.random().toString(36).slice(2)}`,
		nombre: payload.nombre,
		tipo: payload.tipo,
		capacidad: payload.capacidad,
		direccion: payload.direccion,
		estado: "",            // será rellenado por normalize
		statusId,
	};

	const normalized = normalizeFacility(facilityData, fallback);

	if (installationsCache) {
		installationsCache = [...installationsCache, normalized];
	}

	clearInstallationsCache();

	return normalized;
}

/** UPDATE */
export async function updateInstallation(
	id: number | string,
	payload: InstallationPayload
): Promise<Installation> {
	if (!isApiConfigured) throw new Error("API base URL is not configured");

	const numericId = Number(id);
	if (!Number.isFinite(numericId)) throw new Error("ID inválido");

	const statusId = parseStatusId(payload.estadoId);

	const body: FacilityApi = {
		id: numericId,
		name: payload.nombre,
		type: payload.tipo,
		capacity: payload.capacidad,
		address: payload.direccion,
		status_ID: statusId,
	};

	const raw = await apiFetchJson<FacilitySingleResponse | FacilityApi>(
		"/api/Facility/UpdateFacilityAsync",
		{
			method: "POST",
			body: JSON.stringify(body),
		}
	);

	const facilityData =
		typeof raw === "object" && raw !== null && "data" in raw ? raw.data : raw;

	// ⛔ PUT tampoco devuelve estado string → mantenemos el fallback viejo
	const fallback: Installation = {
		id: numericId,
		nombre: payload.nombre,
		tipo: payload.tipo,
		capacidad: payload.capacidad,
		direccion: payload.direccion,
		estado: "",  // normalize lo corregirá
		statusId,
	};

	const normalized = normalizeFacility(facilityData, fallback);

	if (installationsCache) {
		installationsCache = installationsCache.map((i) =>
			i.id === numericId ? normalized : i
		);
	}

	clearInstallationsCache();

	return normalized;
}

/** DELETE */
export async function deleteInstallation(id: number | string): Promise<void> {
	if (!isApiConfigured) throw new Error("API base URL is not configured");

	const numericId = Number(id);
	if (!Number.isFinite(numericId)) throw new Error("ID inválido");

	await apiFetchJson(`/api/Facility/DeleteFacilityFront?id=${numericId}`, {
		method: "DELETE",
	});

	if (installationsCache) {
		installationsCache = installationsCache.filter((i) => i.id !== numericId);
	}
}
