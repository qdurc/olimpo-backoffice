import { isApiConfigured } from "./http";

export type Discipline = {
	id: number | string;
	descripcion: string;
};

export type DisciplinePayload = {
	descripcion: string;
};

function normalizeDiscipline(data: Partial<Discipline>): Discipline {
	return {
		id: data.id ?? `discipline-${Math.random().toString(36).slice(2)}`,
		descripcion: data.descripcion ?? "",
	};
}

/**
 * Placeholder de servicio para disciplinas.
 * Integra las llamadas reales cuando cuentes con el endpoint.
 */
export async function getDisciplines(): Promise<Discipline[]> {
	if (!isApiConfigured) {
		return [];
	}

	// TODO: Reemplazar por llamada real al endpoint de disciplinas.
	console.warn("getDisciplines: servicio pendiente de integrar, devolviendo arreglo vacío.");
	return [];
}

export async function createDiscipline(payload: DisciplinePayload): Promise<Discipline> {
	if (!isApiConfigured) {
		return normalizeDiscipline(payload);
	}

	// TODO: Implementar POST real al endpoint de disciplinas.
	console.warn("createDiscipline: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeDiscipline(payload);
}

export async function updateDiscipline(
	id: number | string,
	payload: DisciplinePayload,
): Promise<Discipline> {
	if (!isApiConfigured) {
		return normalizeDiscipline({ ...payload, id });
	}

	// TODO: Implementar PUT/PATCH real al endpoint de disciplinas.
	console.warn("updateDiscipline: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeDiscipline({ ...payload, id });
}

export async function deleteDiscipline(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		return;
	}

	// TODO: Implementar DELETE real al endpoint de disciplinas.
	console.warn("deleteDiscipline: servicio pendiente de integrar, eliminación no ejecutada.");
}
