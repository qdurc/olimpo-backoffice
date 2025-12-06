import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";

type ReservationApi = {
	id?: number;
	userId?: number;
	facilityId?: number;
	reservedDates?: string;
	estatusID?: number | null;
};

export type Reservation = {
	id: number | string;
	usuarioId: number | null;
	facilityId: number | null;
	instalacion: string;
	fecha: string;
	hora: string;
	estado: string;
	estadoId: number | null;
	fechaIso: string;
};

export type ReservationPayload = {
	facilityId: number | string | null;
	usuarioId: number | string | null;
	fechaIso: string;
	estadoId?: number | string | null;
};

type ReservationApiResponse = {
	data?: ReservationApi[] | ReservationApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type ReservationSingleResponse = {
	data?: ReservationApi | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

type DeleteReservationResponse = {
	data?: boolean | null;
	errors?: unknown[];
	success?: boolean;
	message?: string;
};

function formatDate(dateStr?: string) {
	if (!dateStr) return { fecha: "", hora: "" };
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return { fecha: "", hora: "" };
	return {
		fecha: d.toLocaleDateString(),
		hora: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
	};
}

function toIsoString(value?: string | null) {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function toDotNetDateTime(value?: string | null) {
	if (!value) return undefined;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return undefined;
	const pad = (n: number, size = 2) => n.toString().padStart(size, "0");
	// Format without timezone (e.g., 2025-11-27T01:16:35.100) to match API samples
	const ms = date.getMilliseconds();
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(ms, 3)}`;
}

function parseNum(value: number | string | null | undefined) {
	if (value === null || value === undefined) return null;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function buildReservationBody(payload: ReservationPayload, id?: number): ReservationApi {
	const facilityId = parseNum(payload.facilityId);
	const userId = parseNum(payload.usuarioId);
	const estadoId = parseNum(payload.estadoId ?? null);
	const reservedDates = toDotNetDateTime(payload.fechaIso);

	if (!facilityId || facilityId <= 0) {
		throw new Error("Selecciona una instalación válida antes de guardar.");
	}

	if (!userId || userId <= 0) {
		throw new Error("Ingresa un usuario válido (userId) antes de guardar.");
	}

	if (!reservedDates) {
		throw new Error("La fecha/hora de la reserva no es válida.");
	}

	return {
		...(typeof id === "number" ? { id } : {}),
		facilityId,
		userId,
		reservedDates,
		estatusID: estadoId ?? undefined,
	};
}

function mapReservationError(error: unknown) {
	if (error instanceof Error) {
		if (error.message?.includes("status 500")) {
			return new Error(
				"No se pudo guardar la reserva (500). Verifica que el Usuario ID exista, la instalación sea válida y que la fecha/hora esté completa.",
			);
		}
		return error;
	}

	return new Error("No se pudo guardar la reserva.");
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

function normalizeReservation(
	item: ReservationApi,
	facilityMap: Map<number, Installation>,
): Reservation {
	const { fecha, hora } = formatDate(item.reservedDates);
	const facilityName =
		(item.facilityId !== undefined && facilityMap.get(item.facilityId)?.nombre) ||
		(item.facilityId !== undefined ? `Instalación ${item.facilityId}` : "Sin instalación");

	const estadoId = item.estatusID ?? null;
	const fechaIso = toIsoString(item.reservedDates) ?? "";

	return {
		id: item.id ?? `reservation-${Math.random().toString(36).slice(2)}`,
		usuarioId: item.userId ?? null,
		facilityId: item.facilityId ?? null,
		instalacion: facilityName,
		fecha,
		hora,
		estado: estadoId !== null ? String(estadoId) : "Sin estado",
		estadoId,
		fechaIso,
	};
}

export async function getReservations(
	facilities?: Installation[],
): Promise<Reservation[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	let facilityMap = buildFacilityMap(facilities);
	if (!facilityMap.size) {
		const freshFacilities = await getInstallations();
		facilityMap = buildFacilityMap(freshFacilities);
	}

	const data = await apiFetchJson<ReservationApiResponse | ReservationApi[]>(
		"/api/Reservation/GetAllReservationsFront",
	);

	const reservations = Array.isArray(data)
		? data
		: Array.isArray(data?.data)
			? data.data
			: [];

	return reservations.map((r) => normalizeReservation(r, facilityMap));
}

export async function createReservation(payload: ReservationPayload) {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const body = buildReservationBody(payload);

	let created: ReservationApi | ReservationSingleResponse;
	try {
		created = await apiFetchJson<ReservationApi | ReservationSingleResponse>(
			"/api/Reservation/AddReservation",
			{
				method: "POST",
				body: JSON.stringify(body),
			},
		);
	} catch (error) {
		throw mapReservationError(error);
	}

	const response =
		typeof created === "object" && created !== null && "data" in created
			? (created as ReservationSingleResponse)
			: null;

	const reservationData = response ? response.data : created;

	const facilities = await getInstallations();
	const facilityMap = buildFacilityMap(facilities);

	return normalizeReservation(
		{
			...body,
			...(reservationData || {}),
			facilityId: body.facilityId ?? reservationData?.facilityId,
			userId: body.userId ?? reservationData?.userId,
			reservedDates: body.reservedDates ?? reservationData?.reservedDates,
			estatusID: body.estatusID ?? reservationData?.estatusID,
		},
		facilityMap,
	);
}

export async function updateReservation(
	id: number | string,
	payload: ReservationPayload,
) {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Update requiere un id numérico válido");
	}

	const body = buildReservationBody(payload, numericId);

	let updated: ReservationApi | ReservationSingleResponse;
	try {
		updated = await apiFetchJson<ReservationApi | ReservationSingleResponse>(
			"/api/Reservation/UpdateReservation",
			{
				method: "POST",
				body: JSON.stringify(body),
			},
		);
	} catch (error) {
		throw mapReservationError(error);
	}

	const response =
		typeof updated === "object" && updated !== null && "data" in updated
			? (updated as ReservationSingleResponse)
			: null;

	const reservationData = response ? response.data : updated;

	const facilities = await getInstallations();
	const facilityMap = buildFacilityMap(facilities);

	return normalizeReservation(
		{
			...body,
			...(reservationData || {}),
			facilityId: body.facilityId ?? reservationData?.facilityId,
			userId: body.userId ?? reservationData?.userId,
			reservedDates: body.reservedDates ?? reservationData?.reservedDates,
			estatusID: body.estatusID ?? reservationData?.estatusID,
		},
		facilityMap,
	);
}

export async function deleteReservation(id: number | string): Promise<void> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

	const numericId = typeof id === "number" ? id : Number(id);
	if (!Number.isFinite(numericId)) {
		throw new Error("Delete requiere un id numérico válido");
	}

	const params = new URLSearchParams({ reservationId: String(numericId) });
	await apiFetchJson(`/api/Reservation/DeleteReservation?${params.toString()}`, {
		method: "DELETE",
	}).then((res: DeleteReservationResponse | unknown) => {
		if (
			res &&
			typeof res === "object" &&
			"success" in res &&
			(res as DeleteReservationResponse).success === false
		) {
			const message =
				(res as DeleteReservationResponse).message ??
				"No se pudo eliminar la reserva";
			throw new Error(message);
		}
	});
}
