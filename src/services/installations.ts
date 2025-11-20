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

type MaintenanceApi = {
	id?: number;
	facilityId?: number;
	description?: string;
	startDate?: string;
	endDate?: string;
	userId?: number;
};

export type Maintenance = {
	id: number | string;
	facilityId: number | null;
	nombre: string;
	descripcion: string;
	inicio: string;
	fin: string;
	usuarioId: number | null;
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

export async function getMaintenances(
	facilities?: Installation[],
): Promise<Maintenance[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const maintenances = await apiFetchJson<MaintenanceApi[]>(
		"/api/Maintenance/GetAllMaintenances",
	);

	const facilityMap = new Map<number, Installation>();
	if (facilities?.length) {
		facilities.forEach((f) => {
			if (typeof f.id === "number") {
				facilityMap.set(f.id, f);
			}
		});
	} else {
		const freshFacilities = await getInstallations();
		freshFacilities.forEach((f) => {
			if (typeof f.id === "number") {
				facilityMap.set(f.id, f);
			}
		});
	}

	return Array.isArray(maintenances)
		? maintenances.map((m) => {
				const facilityName =
					(m.facilityId !== undefined && facilityMap.get(m.facilityId)?.nombre) ||
					(m.facilityId !== undefined ? `Instalación ${m.facilityId}` : "Sin instalación");

				return {
					id: m.id ?? `maintenance-${Math.random().toString(36).slice(2)}`,
					facilityId: m.facilityId ?? null,
					nombre: facilityName,
					descripcion: m.description ?? "",
					inicio: m.startDate ?? "",
					fin: m.endDate ?? "",
					usuarioId: m.userId ?? null,
				};
			})
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
