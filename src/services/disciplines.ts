import { apiFetchJson, isApiConfigured } from "./http";

export type Discipline = {
	id: number | string;
	descripcion: string;
};

export type DisciplinePayload = {
	descripcion: string;
};

type DisciplineApi = {
	id?: number;
	descripcion?: string | null;
};

type DisciplineResponse =
	| DisciplineApi[]
	| DisciplineApi
	| {
			data?: DisciplineApi | DisciplineApi[] | null;
			errors?: unknown[];
			success?: boolean;
			message?: string;
	  };

function normalizeDiscipline(
	data: Partial<Discipline> | DisciplineApi | null | undefined,
	fallback?: Discipline,
): Discipline {
	return {
		id:
			(typeof data?.id === "number" && Number.isFinite(data.id)) || typeof data?.id === "string"
				? data.id
				: fallback?.id ?? `discipline-${Math.random().toString(36).slice(2)}`,
		descripcion: (data as DisciplineApi | undefined)?.descripcion ?? fallback?.descripcion ?? "",
	};
}

export async function getDisciplines(): Promise<Discipline[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const response = await apiFetchJson<DisciplineResponse>("/api/Discipline/GetAllDisciplinesFront");
	const payload = Array.isArray(response)
		? response
		: Array.isArray(response?.data)
			? response.data
			: response?.data
				? [response.data]
				: [];

	return payload.map((item) => normalizeDiscipline(item));
}

export async function createDiscipline(payload: DisciplinePayload): Promise<Discipline> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const body = { descripcion: payload.descripcion };
	const response = await apiFetchJson<DisciplineResponse>("/api/Discipline/CreateDiscipline", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const created =
		(Array.isArray((response as any)?.data) ? (response as any).data?.[0] : (response as any)?.data) ??
		(Array.isArray(response) ? response[0] : response);

	return normalizeDiscipline(created, normalizeDiscipline(payload));
}

export async function updateDiscipline(
	id: number | string,
	payload: DisciplinePayload,
): Promise<Discipline> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	const body = { id: requestId, descripcion: payload.descripcion };
	const response = await apiFetchJson<DisciplineResponse>("/api/Discipline/UpdateDiscipline", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const updated =
		(Array.isArray((response as any)?.data) ? (response as any).data?.[0] : (response as any)?.data) ??
		(Array.isArray(response) ? response[0] : response);

	return normalizeDiscipline(updated, normalizeDiscipline({ ...payload, id: requestId }));
}

export async function deleteDiscipline(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = Number(id);
	const requestId = Number.isFinite(numericId) ? numericId : id;

	await apiFetchJson<void>(`/api/Discipline/DeleteDiscipline/${requestId}`, {
		method: "DELETE",
	});
}
