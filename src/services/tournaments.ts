import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";

type TournamentApi = {
	id?: number;
	name?: string | null;
	categoryID?: number | null;
	disciplineID?: number | null;
	estatusID?: number | null;
	facilityID?: number | null;
	date?: string | null;
};

export type Tournament = {
	id: number | string;
	nombre: string;
	categoriaId: number | null;
	disciplinaId: number | null;
	estadoId: number | null;
	facilityId: number | null;
	categoria: string;
	disciplina: string;
	estado: string;
	instalacion: string;
	fecha: string;
	fechaIso: string;
};

export type TournamentPayload = {
	nombre: string;
	categoriaId: number | string | null;
	disciplinaId: number | string | null;
	estadoId?: number | string | null;
	facilityId: number | string | null;
	fechaIso: string;
};

function parseNum(value?: number | string | null) {
	if (value === null || value === undefined || value === "") return null;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function toIsoString(value?: string | null) {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function formatDateTime(value?: string | null) {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function buildFacilityMap(facilities?: Installation[]) {
	const facilityMap = new Map<number, Installation>();
	if (facilities?.length) {
		facilities.forEach((f) => {
			if (typeof f.id === "number") {
				facilityMap.set(f.id, f);
			}
		});
	}
	return facilityMap;
}

async function resolveFacilityMap(facilities?: Installation[]) {
	const map = buildFacilityMap(facilities);
	if (map.size) return map;

	const fresh = await getInstallations();
	return buildFacilityMap(fresh);
}

function normalizeTournament(
	item: TournamentApi,
	facilityMap: Map<number, Installation>,
): Tournament {
	const facilityId = item.facilityID ?? null;
	const categoryId = item.categoryID ?? null;
	const disciplineId = item.disciplineID ?? null;
	const estadoId = item.estatusID ?? null;
	const facilityName =
		(facilityId !== null && facilityMap.get(facilityId)?.nombre) ||
		(facilityId !== null ? `Instalación ${facilityId}` : "Sin instalación");

	const fechaIso = item.date ?? "";

	return {
		id: item.id ?? `tournament-${Math.random().toString(36).slice(2)}`,
		nombre: item.name ?? "",
		categoriaId: categoryId,
		disciplinaId: disciplineId,
		estadoId,
		facilityId,
		categoria: categoryId !== null ? String(categoryId) : "Sin categoría",
		disciplina: disciplineId !== null ? String(disciplineId) : "Sin disciplina",
		estado: estadoId !== null ? String(estadoId) : "Sin estado",
		instalacion: facilityName,
		fecha: formatDateTime(fechaIso),
		fechaIso,
	};
}

export async function getTournaments(
	facilities?: Installation[],
): Promise<Tournament[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const facilityMap = await resolveFacilityMap(facilities);
	const tournaments = await apiFetchJson<TournamentApi[]>(
		"/api/Tournaments/GetAllTournamentsFront",
	);

	return Array.isArray(tournaments)
		? tournaments.map((t) => normalizeTournament(t, facilityMap))
		: [];
}

export async function createTournament(payload: TournamentPayload): Promise<Tournament> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const body: TournamentApi = {
		name: payload.nombre,
		categoryID: parseNum(payload.categoriaId),
		disciplineID: parseNum(payload.disciplinaId),
		estatusID: parseNum(payload.estadoId),
		facilityID: parseNum(payload.facilityId),
		date: toIsoString(payload.fechaIso),
	};

	const created = await apiFetchJson<TournamentApi>("/api/Tournaments/CreateTournament", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const facilityMap = await resolveFacilityMap();
	return normalizeTournament({ ...body, ...created }, facilityMap);
}

export async function updateTournament(
	id: number | string,
	payload: TournamentPayload,
): Promise<Tournament> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Update requiere un id numérico válido");
	}

	const body: TournamentApi = {
		id: numericId,
		name: payload.nombre,
		categoryID: parseNum(payload.categoriaId),
		disciplineID: parseNum(payload.disciplinaId),
		estatusID: parseNum(payload.estadoId),
		facilityID: parseNum(payload.facilityId),
		date: toIsoString(payload.fechaIso),
	};

	const updated = await apiFetchJson<TournamentApi>("/api/Tournaments/UpdateTournament", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const facilityMap = await resolveFacilityMap();
	return normalizeTournament({ ...body, ...updated }, facilityMap);
}

export async function deleteTournament(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Delete requiere un id numérico válido");
	}

	const params = new URLSearchParams({ id: String(numericId) });
	await apiFetchJson(`/api/Tournaments/DeleteTournament?${params.toString()}`, {
		method: "DELETE",
	});
}
