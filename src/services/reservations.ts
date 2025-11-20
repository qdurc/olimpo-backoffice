import { apiFetchJson, isApiConfigured } from "./http";
import { getInstallations, type Installation } from "./installations";

type ReservationApi = {
	id?: number;
	userId?: number;
	facilityId?: number;
	reservedDates?: string;
	status?: number;
};

export type Reservation = {
	id: number | string;
	usuarioId: number | null;
	facilityId: number | null;
	instalacion: string;
	fecha: string;
	hora: string;
	estado: string;
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

export async function getReservations(
	facilities?: Installation[],
): Promise<Reservation[]> {
	if (!isApiConfigured) {
		throw new Error("API base URL is not configured (VITE_API_URL missing)");
	}

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

	const data = await apiFetchJson<ReservationApi[]>(
		"/api/Reservation/GetReservations",
	);

	return Array.isArray(data)
		? data.map((r) => {
				const { fecha, hora } = formatDate(r.reservedDates);
				const facilityName =
					(r.facilityId !== undefined && facilityMap.get(r.facilityId)?.nombre) ||
					(r.facilityId !== undefined ? `Instalación ${r.facilityId}` : "Sin instalación");

				return {
					id: r.id ?? `reservation-${Math.random().toString(36).slice(2)}`,
					usuarioId: r.userId ?? null,
					facilityId: r.facilityId ?? null,
					instalacion: facilityName,
					fecha,
					hora,
					estado:
						typeof r.status === "number"
							? String(r.status)
							: r.status ?? "Sin estado",
				};
			})
		: [];
}
