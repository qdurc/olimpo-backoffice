import { apiFetchJson, isApiConfigured } from "./http";

export type Category = {
	id: number | string;
	descripcion: string;
};

export type CategoryPayload = {
	descripcion: string;
};

type CategoryApi = {
	id?: number;
	descripcion?: string | null;
};

type CategoryResponse =
	| CategoryApi[]
	| CategoryApi
	| {
		data?: CategoryApi | CategoryApi[] | null;
		errors?: unknown[];
		success?: boolean;
		message?: string;
	};

function normalizeCategory(data: Partial<Category> | CategoryApi | null | undefined, fallback?: Category): Category {
	return {
		id:
			(typeof data?.id === "number" && Number.isFinite(data.id)) || typeof data?.id === "string"
				? data.id
				: fallback?.id ?? `categoria-${Math.random().toString(36).slice(2)}`,
		descripcion: (data as CategoryApi | undefined)?.descripcion ?? fallback?.descripcion ?? "",
	};
}

export async function getCategories(): Promise<Category[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const response = await apiFetchJson<CategoryResponse>("/api/Category/GetAllCategoriesFront");
	const payload = Array.isArray(response)
		? response
		: Array.isArray(response?.data)
			? response.data
			: response?.data
				? [response.data]
				: [];

	return payload.map((item) => normalizeCategory(item));
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const body = { descripcion: payload.descripcion, status: 1 };
	const response = await apiFetchJson<CategoryResponse>("/api/Category/CreateCategory", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const created =
		(Array.isArray((response as any)?.data) ? (response as any).data?.[0] : (response as any)?.data) ??
		(Array.isArray(response) ? response[0] : response);

	return normalizeCategory(created, normalizeCategory(payload));
}

export async function updateCategory(
	id: number | string,
	payload: CategoryPayload,
): Promise<Category> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const body = { id: requestId, descripcion: payload.descripcion, status: 1 };
	const response = await apiFetchJson<CategoryResponse>("/api/Category/UpdateCategory", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const updated =
		(Array.isArray((response as any)?.data) ? (response as any).data?.[0] : (response as any)?.data) ??
		(Array.isArray(response) ? response[0] : response);

	return normalizeCategory(updated, normalizeCategory({ ...payload, id: requestId }));
}

export async function deleteCategory(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	await apiFetchJson<void>(`/api/Category/DeleteCategory/${requestId}`, {
		method: "DELETE",
	});
}
