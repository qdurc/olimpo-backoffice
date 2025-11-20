import { apiFetchJson, isApiConfigured } from "./http";
import { Installation, getInstallations } from "./installations";

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
