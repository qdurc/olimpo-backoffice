import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";

type MaintenanceApi = {
	id?: number;
	facilityId?: number;
	description?: string;
	startDate?: string;
	endDate?: string;
	userId?: number;
	estatusID?: number | null;
};

export const maintenanceStatuses = [
	{ id: 1, label: "Activo" },
	{ id: 2, label: "Inactivo" },
	{ id: 3, label: "En Mantenimiento" },
	{ id: 4, label: "Reservado" },
];

export type Maintenance = {
	id: number | string;
	facilityId: number | null;
	nombre: string;
	descripcion: string;
	inicio: string;
	fin: string;
	usuarioId: number | null;
	estadoId: number | null;
	estado: string;
};

export type MaintenancePayload = {
	facilityId: number | string | null;
	descripcion: string;
	inicio: string;
	fin: string;
	usuarioId?: number | string | null;
	estadoId?: number | string | null;
};

let maintenancesCache: Maintenance[] | null = null;
let maintenancesPromise: Promise<Maintenance[]> | null = null;

type MaintenanceApiResponse = {
	data?: MaintenanceApi[] | MaintenanceApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type MaintenanceSingleResponse = {
	data?: MaintenanceApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type DeleteMaintenanceResponse = {
	data?: boolean | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

function parseNum(input?: number | string | null) {
	if (input === null || input === undefined) return undefined;
	if (typeof input === "number" && Number.isFinite(input)) return input;
	const parsed = Number(input);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeStatusId(value: number | string | null | undefined) {
	if (value === null || value === undefined) return null;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function toIsoString(value?: string | null) {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function normalizeMaintenance(
	item: MaintenanceApi,
	facilityMap: Map<number, Installation>,
): Maintenance {
	const facilityId = item.facilityId ?? null;
	const statusId = normalizeStatusId(item.estatusID) ?? null;
	const statusText =
		statusId !== null
			? maintenanceStatuses.find((s) => s.id === statusId)?.label ?? String(statusId)
			: "Sin estado";
	const facilityName =
		(facilityId !== null && facilityMap.get(facilityId)?.nombre) ||
		(facilityId !== null ? `Instalación ${facilityId}` : "Sin instalación");

	return {
		id: item.id ?? `maintenance-${Math.random().toString(36).slice(2)}`,
		facilityId,
		nombre: facilityName,
		descripcion: item.description ?? "",
		inicio: item.startDate ?? "",
		fin: item.endDate ?? "",
		usuarioId: item.userId ?? null,
		estadoId: statusId,
		estado: statusText,
	};
}

async function buildFacilityMap(facilities?: Installation[]) {
	const facilityMap = new Map<number, Installation>();
	if (facilities?.length) {
		facilities.forEach((f) => {
			if (typeof f.id === "number") {
				facilityMap.set(f.id, f);
			}
		});
		return facilityMap;
	}

	const freshFacilities = await getInstallations();
	freshFacilities.forEach((f) => {
		if (typeof f.id === "number") {
			facilityMap.set(f.id, f);
		}
	});
	return facilityMap;
}

export async function getMaintenances(
	facilities?: Installation[],
): Promise<Maintenance[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	if (maintenancesCache) {
		return maintenancesCache;
	}

	if (maintenancesPromise) {
		return maintenancesPromise;
	}

	const request = (async () => {
		const facilityMap = await buildFacilityMap(facilities);
		const maintenancesResponse = await apiFetchJson<MaintenanceApiResponse | MaintenanceApi[]>(
			"/api/Maintenance/GetAllMaintenancesFront",
		);

		const maintenances = Array.isArray(maintenancesResponse)
			? maintenancesResponse
			: Array.isArray(maintenancesResponse?.data)
				? maintenancesResponse.data
				: [];

		const normalized = maintenances.map((m) => normalizeMaintenance(m, facilityMap));

		maintenancesCache = normalized;
		return normalized;
	})();

	maintenancesPromise = request;

	try {
		return await request;
	} finally {
		maintenancesPromise = null;
	}
}

export function clearMaintenancesCache() {
	maintenancesCache = null;
	maintenancesPromise = null;
}

export async function createMaintenance(payload: MaintenancePayload): Promise<Maintenance> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const startDate = toIsoString(payload.inicio);
	const endDate = toIsoString(payload.fin);

	const body: MaintenanceApi = {
		facilityId: parseNum(payload.facilityId),
		description: payload.descripcion,
		startDate,
		endDate,
		userId: parseNum(payload.usuarioId),
		estatusID: parseNum(payload.estadoId),
	};

	const created = await apiFetchJson<MaintenanceApi>(
		"/api/Maintenance/CreateMaintenance",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const facilityMap = await buildFacilityMap();

	const normalized = normalizeMaintenance(
		{
			...created,
			facilityId: body.facilityId ?? created?.facilityId,
			startDate: body.startDate ?? created?.startDate,
			endDate: body.endDate ?? created?.endDate,
			description: body.description ?? created?.description,
			userId: body.userId ?? created?.userId,
			estatusID: body.estatusID ?? created?.estatusID,
		},
		facilityMap,
	);

	if (maintenancesCache) {
		maintenancesCache = [...maintenancesCache, normalized];
	}
	return normalized;
}

export async function updateMaintenance(
	id: number | string,
	payload: MaintenancePayload,
): Promise<Maintenance> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Update requiere un id numérico válido");
	}

	const startDate = toIsoString(payload.inicio);
	const endDate = toIsoString(payload.fin);

	const body: MaintenanceApi = {
		id: numericId,
		facilityId: parseNum(payload.facilityId),
		description: payload.descripcion,
		startDate,
		endDate,
		userId: parseNum(payload.usuarioId),
		estatusID: parseNum(payload.estadoId),
	};

	const updated = await apiFetchJson<MaintenanceApi | MaintenanceSingleResponse>(
		"/api/Maintenance/UpdateMaintenance",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const response =
		typeof updated === "object" && updated !== null && "data" in updated
			? (updated as MaintenanceSingleResponse)
			: null;

	const maintenanceData = response ? response.data : updated;

	const facilityMap = await buildFacilityMap();
	const normalized = normalizeMaintenance(
		{ ...body, ...(maintenanceData || {}) },
		facilityMap,
	);

	if (maintenancesCache) {
		maintenancesCache = maintenancesCache.map((item) =>
			item.id === id ? normalized : item,
		);
	}

	return normalized;
}

export async function deleteMaintenance(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Delete requiere un id numérico válido");
	}

	const params = new URLSearchParams({ id: String(numericId) });
	await apiFetchJson(`/api/Maintenance/DeleteMaintenanceById?${params.toString()}`, {
		method: "DELETE",
	}).then((res: DeleteMaintenanceResponse | unknown) => {
		if (
			res &&
			typeof res === "object" &&
			"success" in res &&
			(res as DeleteMaintenanceResponse).success === false
		) {
			const message =
				(res as DeleteMaintenanceResponse).message ??
				"No se pudo eliminar el mantenimiento";
			throw new Error(message);
		}
	});

	if (maintenancesCache) {
		maintenancesCache = maintenancesCache.filter(
			(item) => Number(item.id) !== numericId,
		);
	}
}
