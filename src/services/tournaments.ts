// src/services/tournaments.ts
import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";
import { getTournamentViewModel } from "./tournamentViewModel";

type TournamentApi = {
	id?: number;
	name?: string | null;

	category?: string | null;
	categoryID?: number | null;

	discipline?: string | null;
	disciplineID?: number | null;

	status?: string | null;
	estatusID?: number | null;

	facility?: string | null;
	facilityID?: number | null;

	supervisor?: string | null;
	supervisorID?: number | null;

	description?: string | null;
	rules?: string | null;

	date?: string | null;
};

export type Tournament = {
	id: number | string;
	nombre: string;
	descripcion: string;
	normas: string;
	categoriaId: number | null;
	disciplinaId: number | null;
	estadoId: number | null;
	facilityId: number | null;
	supervisorId: number | null;
	categoria: string;
	disciplina: string;
	estado: string;
	instalacion: string | false;
	supervisor: string;
	fecha: string;
	fechaIso: string;
};

export type TournamentPayload = {
	nombre: string;
	descripcion?: string;
	normas?: string;
	categoriaId: number | string | null;
	disciplinaId: number | string | null;
	estadoId?: number | string | null;
	facilityId: number | string | null;
	fechaIso: string;
	supervisorId?: number | string | null;
};

type ViewModel = {
	facilities: Array<{ id: number; name: string }>;
	estatus: Array<{ estatusID: number; descripcion: string }>;
	categories: Array<{ id: number; descripcion: string }>;
	disciplines: Array<{ id: number; descripcion: string }>;
	encargados: Array<{ id: number; fullName: string }>;
};

function parseNum(value?: number | string | null) {
	if (value === null || value === undefined || value === "") return null;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value?: string | null) {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value?: string | null) {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function buildFacilityMap(facilities?: Installation[]) {
	const map = new Map<number, Installation>();
	if (facilities?.length) {
		facilities.forEach((f) => {
			if (typeof f.id === "number") map.set(f.id, f);
		});
	}
	return map;
}

async function resolveFacilityMap(facilities?: Installation[]) {
	const map = buildFacilityMap(facilities);
	if (map.size) return map;
	const fresh = await getInstallations();
	return buildFacilityMap(fresh);
}

/**
 * Obtiene view model (categorias, disciplinas, estatus, encargados) y construye mapas
 */
async function getViewMaps(): Promise<{
	catMap: Map<number, string>;
	discMap: Map<number, string>;
	statusMap: Map<number, string>;
	encMap: Map<number, string>;
	facilityMapSimple: Map<number, string>;
}> {
	const vmRaw = await getTournamentViewModel();
	const vm = vmRaw as unknown as ViewModel;

	const catMap = new Map<number, string>();
	(vm.categories ?? []).forEach((c) => {
		if (c?.id !== undefined) catMap.set(Number(c.id), c.descripcion ?? String(c.id));
	});

	const discMap = new Map<number, string>();
	(vm.disciplines ?? []).forEach((d) => {
		if (d?.id !== undefined) discMap.set(Number(d.id), d.descripcion ?? String(d.id));
	});

	const statusMap = new Map<number, string>();
	(vm.estatus ?? []).forEach((s: any) => {
		// en el view model estatus tiene estatusID y descripcion
		if (s?.estatusID !== undefined) statusMap.set(Number(s.estatusID), s.descripcion ?? String(s.estatusID));
	});

	const encMap = new Map<number, string>();
	(vm.encargados ?? []).forEach((e) => {
		if (e?.id !== undefined) encMap.set(Number(e.id), (e as any).fullName ?? String(e.id));
	});

	const facilityMapSimple = new Map<number, string>();
	(vm.facilities ?? []).forEach((f) => {
		if (f?.id !== undefined) facilityMapSimple.set(Number(f.id), f.name ?? String(f.id));
	});

	return { catMap, discMap, statusMap, encMap, facilityMapSimple };
}

function normalizeTournament(
	item: TournamentApi,
	facilityMap: Map<number, Installation>,
	helpers?: {
		catMap?: Map<number, string>;
		discMap?: Map<number, string>;
		statusMap?: Map<number, string>;
		encMap?: Map<number, string>;
		facilityMapSimple?: Map<number, string>;
	},
): Tournament {
	const facilityId = item.facilityID ?? null;
	const categoryId = item.categoryID ?? null;
	const disciplineId = item.disciplineID ?? null;
	const estadoId = item.estatusID ?? null;
	const supervisorId = item.supervisorID ?? null;

	// preferir nombre directo de la respuesta; si no, buscar en viewmodel maps; si no, usar ID string
	const categoria =
		item.category ??
		(helpers?.catMap?.get(Number(categoryId ?? -1)) ?? (categoryId !== null ? String(categoryId) : "Sin categoría"));

	const disciplina =
		item.discipline ??
		(helpers?.discMap?.get(Number(disciplineId ?? -1)) ?? (disciplineId !== null ? String(disciplineId) : "Sin disciplina"));

	const estado =
		item.status ??
		(helpers?.statusMap?.get(Number(estadoId ?? -1)) ?? (estadoId !== null ? String(estadoId) : "Sin estado"));

	const supervisor =
		item.supervisor ??
		(helpers?.encMap?.get(Number(supervisorId ?? -1)) ?? (supervisorId !== null ? String(supervisorId) : ""));

	const facilityName =
		item.facility ??
		(helpers?.facilityMapSimple?.get(Number(facilityId ?? -1)) ??
			((facilityId !== null && facilityMap.get(Number(facilityId))?.nombre) ?? (facilityId !== null ? `Instalación ${facilityId}` : "Sin instalación")));

	return {
		id: item.id ?? `tournament-${Math.random().toString(36).slice(2)}`,
		nombre: item.name ?? "",
		descripcion: item.description ?? "",
		normas: item.rules ?? "",
		categoriaId: categoryId ?? null,
		disciplinaId: disciplineId ?? null,
		estadoId: estadoId ?? null,
		facilityId: facilityId ?? null,
		supervisorId: supervisorId ?? null,
		categoria,
		disciplina,
		estado,
		instalacion: facilityName,
		supervisor,
		fechaIso: item.date ?? "",
		fecha: formatDateTime(item.date),
	};
}

/** GET all tournaments */
export async function getTournaments(facilities?: Installation[]): Promise<Tournament[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const [facilityMap, viewMaps] = await Promise.all([resolveFacilityMap(facilities), getViewMaps()]);

	const tournamentsResponse = await apiFetchJson<any>("/api/Tournaments/GetAllTournamentsFront");
	const tournamentsList: TournamentApi[] = Array.isArray(tournamentsResponse)
		? tournamentsResponse
		: Array.isArray(tournamentsResponse?.data)
			? tournamentsResponse.data
			: [];

	return tournamentsList.map((t) => normalizeTournament(t, facilityMap, viewMaps));
}

/** CREATE tournament */
export async function createTournament(payload: TournamentPayload): Promise<Tournament> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const startDate = parseDate(payload.fechaIso);
	if (!startDate) throw new Error("Fecha inválida");

	const categoryID = parseNum(payload.categoriaId);
	const disciplineID = parseNum(payload.disciplinaId);
	const estatusID = parseNum(payload.estadoId) ?? 0; // enviar siempre estatusID según tu requerimiento
	const facilityID = parseNum(payload.facilityId);
	const supervisorID = parseNum(payload.supervisorId) ?? 0; // enviar siempre supervisorID según tu requerimiento

	const body: TournamentApi = {
		name: payload.nombre,
		description: payload.descripcion ?? "",
		rules: payload.normas ?? "",
		...(categoryID !== null ? { categoryID } : {}),
		...(disciplineID !== null ? { disciplineID } : {}),
		estatusID,
		facilityID,
		supervisorID,
		date: startDate.toISOString(),
	};

	const created = await apiFetchJson<any>("/api/Tournaments/CreateTournament", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const data = created?.data ?? created ?? body;

	const facilityMap = await resolveFacilityMap();
	const viewMaps = await getViewMaps();
	return normalizeTournament({ ...body, ...data }, facilityMap, viewMaps);
}

/** UPDATE tournament */
export async function updateTournament(id: number | string, payload: TournamentPayload): Promise<Tournament> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) throw new Error("Update requiere un id numérico válido");

	const startDate = parseDate(payload.fechaIso);
	if (!startDate) throw new Error("Fecha inválida");

	const categoryID = parseNum(payload.categoriaId);
	const disciplineID = parseNum(payload.disciplinaId);
	const estatusID = parseNum(payload.estadoId) ?? 0;
	const facilityID = parseNum(payload.facilityId);
	const supervisorID = parseNum(payload.supervisorId) ?? 0;

	const body: TournamentApi = {
		id: numericId,
		name: payload.nombre,
		description: payload.descripcion ?? "",
		rules: payload.normas ?? "",
		...(categoryID !== null ? { categoryID } : {}),
		...(disciplineID !== null ? { disciplineID } : {}),
		estatusID,
		facilityID,
		supervisorID,
		date: startDate.toISOString(),
	};

	const updated = await apiFetchJson<any>("/api/Tournaments/UpdateTournament", {
		method: "POST",
		body: JSON.stringify(body),
	});

	const data = updated?.data ?? updated ?? body;

	const facilityMap = await resolveFacilityMap();
	const viewMaps = await getViewMaps();
	return normalizeTournament({ ...body, ...data }, facilityMap, viewMaps);
}

/** DELETE tournament */
export async function deleteTournament(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) throw new Error("Delete requiere un id numérico válido");

	const params = new URLSearchParams({ id: String(numericId) });
	await apiFetchJson(`/api/Tournaments/DeleteTournament?${params.toString()}`, {
		method: "DELETE",
	});
}
