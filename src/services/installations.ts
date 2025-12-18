import { apiFetchJson, isApiConfigured } from "./http";

type FacilityApi = {
	id?: number;
	name?: string;
	type?: string;
	capacity?: number;
	address?: string;
	status?: string | number | null;
	status_ID?: number | null;
};

export const installationStatuses = [
	{ id: 1, label: "Activo" },
	{ id: 2, label: "Inactivo" },
	{ id: 3, label: "En Mantenimiento" },
	{ id: 4, label: "Reservado" },
];

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

type FacilityApiResponse = {
	data?: FacilityApi[] | FacilityApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type FacilitySingleResponse = {
	data?: FacilityApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type DeleteFacilityResponse = {
	data?: boolean | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

function normalizeFacility(data?: FacilityApi | null, fallback?: Installation): Installation {
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

	const numFromStatus =
		typeof data.status === "number"
			? data.status
			: typeof data.status === "string" && !Number.isNaN(Number(data.status))
				? Number(data.status)
				: null;

	const statusNumeric =
		typeof data.status === "number"
			? data.status
			: typeof data.status_ID === "number"
				? data.status_ID
				: numFromStatus;

	const statusTextFromNumber =
		typeof statusNumeric === "number"
			? installationStatuses.find((status) => status.id === statusNumeric)?.label ?? null
			: null;

	const statusId =
		statusNumeric ??
		(typeof data.status === "number" ? data.status : undefined) ??
		data.status_ID ??
		fallback?.statusId ??
		null;

	const fallbackId =
		data.id ??
		fallback?.id ??
		`facility-${Math.random().toString(36).slice(2)}`;

	const statusString = typeof data.status === "string" ? data.status.trim() : "";
	const statusStringIsNumeric =
		statusString !== "" && !Number.isNaN(Number(statusString));

	return {
		id: fallbackId,
		nombre: data.name ?? fallback?.nombre ?? "",
		tipo: data.type ?? fallback?.tipo ?? "",
		capacidad: data.capacity ?? fallback?.capacidad ?? 0,
		direccion: data.address ?? fallback?.direccion ?? "",
		estado:
			typeof data.status === "string"
				? statusStringIsNumeric
					? statusTextFromNumber ?? statusString
					: statusString
				: statusTextFromNumber ??
					(typeof data.status === "number"
						? String(data.status)
						: typeof data.status_ID === "number"
							? String(data.status_ID)
							: fallback?.estado ?? "Sin estado"),
		statusId,
	};
}

function parseStatusId(statusId?: number | string | null) {
	if (statusId === null || statusId === undefined) return null;
	if (typeof statusId === "number" && !Number.isNaN(statusId)) return statusId;
	const parsed = Number(statusId);
	return Number.isNaN(parsed) ? null : parsed;
}

function statusLabelFromId(statusId?: number | null) {
	if (typeof statusId !== "number") return null;
	return installationStatuses.find((status) => status.id === statusId)?.label ?? null;
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
		const response = await apiFetchJson<FacilityApiResponse | FacilityApi[]>(
			"/api/Facility/GetAllFacilitiesAsyncFront",
		);

		const facilities = Array.isArray(response)
			? response
			: Array.isArray(response?.data)
				? response.data
				: [];

		const normalized = facilities.map((facility) => normalizeFacility(facility));

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
		status: statusId ?? null,
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
			statusLabelFromId(statusId) ??
			payload.estado ??
			(statusId !== null ? String(statusId) : "Sin estado"),
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
		status: statusId ?? null,
		status_ID: statusId,
	};

	const facility = await apiFetchJson<FacilityApi>("/api/Facility/UpdateFacilityAsync", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const response =
		typeof facility === "object" && facility !== null && "data" in facility
			? (facility as FacilitySingleResponse)
			: null;

	const facilityData = response ? response.data : facility;

	const fallbackNormalized: Installation = {
		id: numericId,
		nombre: payload.nombre,
		tipo: payload.tipo,
		capacidad: payload.capacidad,
		direccion: payload.direccion,
		estado:
			statusLabelFromId(statusId) ??
			payload.estado ??
			(statusId !== null ? String(statusId) : "Sin estado"),
		statusId: parseStatusId(payload.estadoId),
	};

	const normalized =
		facilityData && typeof facilityData === "object"
			? normalizeFacility({ ...facilityData, id: numericId }, fallbackNormalized)
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
	}).then((res: DeleteFacilityResponse | unknown) => {
		// Si la API indica fallo, propagamos un error para manejarlo en la UI.
		if (
			res &&
			typeof res === "object" &&
			"success" in res &&
			(res as DeleteFacilityResponse).success === false
		) {
			const message =
				(res as DeleteFacilityResponse).message ?? "No se pudo eliminar la instalación";
			throw new Error(message);
		}
	});

	if (installationsCache) {
		installationsCache = installationsCache.filter((item) => item.id !== id);
	}
}
