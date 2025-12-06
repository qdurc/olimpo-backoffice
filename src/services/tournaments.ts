import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";

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
	supervisorID?: number | null;
	supervisor?: string | null;
	date?: string | null;
	dateUntil?: string | null;
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
	fechaFinIso?: string;
	supervisorId?: number | string | null;
};

type TournamentApiResponse = {
	data?: TournamentApi[] | TournamentApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type TournamentSingleResponse = {
	data?: TournamentApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type DeleteTournamentResponse = {
	data?: boolean | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
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

function parseDate(value?: string | null) {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value?: string | null) {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function isPlaceholderTournament(data?: TournamentApi | null) {
	if (!data) return false;
	const hasDefaultStrings = data.name === "string";
	const hasDefaultNumbers =
		(data.categoryID === 0 || data.categoryID === null || data.categoryID === undefined) &&
		(data.disciplineID === 0 || data.disciplineID === null || data.disciplineID === undefined) &&
		(data.estatusID === 0 || data.estatusID === null || data.estatusID === undefined) &&
		(data.facilityID === 0 || data.facilityID === null || data.facilityID === undefined) &&
		(data.supervisorID === 0 || data.supervisorID === null || data.supervisorID === undefined);
	return hasDefaultStrings && hasDefaultNumbers;
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
	const categoriaNombre = item.category ?? (categoryId !== null ? String(categoryId) : null);
	const disciplinaNombre = item.discipline ?? (disciplineId !== null ? String(disciplineId) : null);
	const estadoNombre = item.status ?? (estadoId !== null ? String(estadoId) : null);
	const facilityName =
		item.facility ??
		((facilityId !== null && facilityMap.get(facilityId)?.nombre) ||
			(facilityId !== null ? `Instalación ${facilityId}` : "Sin instalación"));

	const fechaIso = item.date ?? "";
	const fechaFinIso = item.dateUntil ?? "";

	return {
		id: item.id ?? `tournament-${Math.random().toString(36).slice(2)}`,
		nombre: item.name ?? "",
		categoriaId: categoryId,
		disciplinaId: disciplineId,
		estadoId,
		facilityId,
		categoria: categoriaNombre ?? "Sin categoría",
		disciplina: disciplinaNombre ?? "Sin disciplina",
		estado: estadoNombre ?? "Sin estado",
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
	const tournamentsResponse = await apiFetchJson<TournamentApiResponse | TournamentApi[]>(
		"/api/Tournaments/GetAllTournamentsFront",
	);

	const tournaments = Array.isArray(tournamentsResponse)
		? tournamentsResponse
		: Array.isArray(tournamentsResponse?.data)
			? tournamentsResponse.data
			: [];

	return tournaments.map((t) => normalizeTournament(t, facilityMap));
}

export async function createTournament(payload: TournamentPayload): Promise<Tournament> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const startDate = parseDate(payload.fechaIso);
	const endDate = parseDate(payload.fechaFinIso ?? payload.fechaIso);
	if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
		throw new Error("La fecha fin no puede ser menor que la fecha de inicio.");
	}

	const categoryID = parseNum(payload.categoriaId);
	const disciplineID = parseNum(payload.disciplinaId);
	const estatusID = parseNum(payload.estadoId);
	const facilityID = parseNum(payload.facilityId);
	const supervisorID = parseNum(payload.supervisorId);

	const body: TournamentApi = {
		name: payload.nombre,
		...(categoryID !== null ? { categoryID } : {}),
		...(disciplineID !== null ? { disciplineID } : {}),
		...(estatusID !== null ? { estatusID } : {}),
		...(facilityID !== null ? { facilityID } : {}),
		date: startDate?.toISOString(),
		dateUntil: endDate?.toISOString(),
		...(supervisorID !== null ? { supervisorID } : {}),
	};

	const created = await apiFetchJson<TournamentApi | TournamentSingleResponse>(
		"/api/Tournaments/CreateTournament",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const response =
		typeof created === "object" && created !== null && "data" in created
			? (created as TournamentSingleResponse)
			: null;

	const tournamentData = response ? response.data : created;
	const useFallback = isPlaceholderTournament(tournamentData);

	const facilityMap = await resolveFacilityMap();
	const baseData = useFallback ? body : { ...body, ...(tournamentData || {}) };
	return normalizeTournament(baseData, facilityMap);
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

	const startDate = parseDate(payload.fechaIso);
	const endDate = parseDate(payload.fechaFinIso ?? payload.fechaIso);
	if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
		throw new Error("La fecha fin no puede ser menor que la fecha de inicio.");
	}

	const categoryID = parseNum(payload.categoriaId);
	const disciplineID = parseNum(payload.disciplinaId);
	const estatusID = parseNum(payload.estadoId);
	const facilityID = parseNum(payload.facilityId);
	const supervisorID = parseNum(payload.supervisorId);

	const body: TournamentApi = {
		id: numericId,
		name: payload.nombre,
		...(categoryID !== null ? { categoryID } : {}),
		...(disciplineID !== null ? { disciplineID } : {}),
		...(estatusID !== null ? { estatusID } : {}),
		...(facilityID !== null ? { facilityID } : {}),
		date: startDate?.toISOString(),
		dateUntil: endDate?.toISOString(),
		...(supervisorID !== null ? { supervisorID } : {}),
	};

	const updated = await apiFetchJson<TournamentApi | TournamentSingleResponse>(
		"/api/Tournaments/UpdateTournament",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);

	const response =
		typeof updated === "object" && updated !== null && "data" in updated
			? (updated as TournamentSingleResponse)
			: null;

	const tournamentData = response ? response.data : updated;
	const useFallback = isPlaceholderTournament(tournamentData);

	const facilityMap = await resolveFacilityMap();
	const baseData = useFallback ? body : { ...body, ...(tournamentData || {}) };
	return normalizeTournament(baseData, facilityMap);
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
	}).then((res: DeleteTournamentResponse | unknown) => {
		if (
			res &&
			typeof res === "object" &&
			"success" in res &&
			(res as DeleteTournamentResponse).success === false
		) {
			const message =
				(res as DeleteTournamentResponse).message ??
				"No se pudo eliminar el torneo";
			throw new Error(message);
		}
	});
}
