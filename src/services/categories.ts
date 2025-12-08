import { isApiConfigured } from "./http";

export type Category = {
	id: number | string;
	descripcion: string;
};

export type CategoryPayload = {
	descripcion: string;
};

function normalizeCategory(data: Partial<Category>): Category {
	return {
		id: data.id ?? `categoria-${Math.random().toString(36).slice(2)}`,
		descripcion: data.descripcion ?? "",
	};
}

/**
 * Placeholder de servicio para categorías.
 * Conecta tus endpoints reales cuando estén listos.
 */
export async function getCategories(): Promise<Category[]> {
	if (!isApiConfigured) {
		return [];
	}

	// TODO: Reemplazar por llamada real al endpoint de categorías.
	console.warn("getCategories: servicio pendiente de integrar, devolviendo arreglo vacío.");
	return [];
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
	if (!isApiConfigured) {
		return normalizeCategory(payload);
	}

	// TODO: Implementar POST real al endpoint de categorías.
	console.warn("createCategory: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeCategory(payload);
}

export async function updateCategory(
	id: number | string,
	payload: CategoryPayload,
): Promise<Category> {
	if (!isApiConfigured) {
		return normalizeCategory({ ...payload, id });
	}

	// TODO: Implementar PUT/PATCH real al endpoint de categorías.
	console.warn("updateCategory: servicio pendiente de integrar, devolviendo payload normalizado.");
	return normalizeCategory({ ...payload, id });
}

export async function deleteCategory(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		return;
	}

	// TODO: Implementar DELETE real al endpoint de categorías.
	console.warn("deleteCategory: servicio pendiente de integrar, eliminación no ejecutada.");
}
