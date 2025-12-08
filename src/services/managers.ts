import { isApiConfigured } from "./http";

export type Manager = {
	id: number | string;
	nombreCompleto: string;
	fechaNacimiento: string; // ISO o texto libre según API
	cedula: string;
};

export type ManagerPayload = {
	nombreCompleto: string;
	fechaNacimiento: string;
	cedula: string;
};

function normalizeManager(data: Partial<Manager>): Manager {
	return {
		id: data.id ?? `manager-${Math.random().toString(36).slice(2)}`,
		nombreCompleto: data.nombreCompleto ?? "",
		fechaNacimiento: data.fechaNacimiento ?? "",
		cedula: data.cedula ?? "",
	};
}

/**
 * Placeholder de servicio para encargados.
 * Integra aquí tus llamadas reales cuando el endpoint esté disponible.
 */
export async function getManagers(): Promise<Manager[]> {
	if (!isApiConfigured) {
		return [];
	}

	// TODO: Reemplazar por llamada real al endpoint de encargados.
	console.warn("getManagers: servicio pendiente de integrar, devolviendo arreglo vacío.");
	return [];
}

export async function createManager(payload: ManagerPayload): Promise<Manager> {
	if (!isApiConfigured) {
		return normalizeManager(payload);
	}

	// TODO: Implementar POST real al endpoint de encargados.
	console.warn("createManager: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeManager(payload);
}

export async function updateManager(
	id: number | string,
	payload: ManagerPayload,
): Promise<Manager> {
	if (!isApiConfigured) {
		return normalizeManager({ ...payload, id });
	}

	// TODO: Implementar PUT/PATCH real al endpoint de encargados.
	console.warn("updateManager: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeManager({ ...payload, id });
}

export async function deleteManager(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		return;
	}

	// TODO: Implementar DELETE real al endpoint de encargados.
	console.warn("deleteManager: servicio pendiente de integrar, eliminación no ejecutada.");
}
