import { getMaintenances } from "./maintenances";
import { apiFetchJson, isApiConfigured } from "./http";
import { getSession } from "./session";

type Facility = {
	id: number;
	status?: string | number | null;
	status_ID?: number | null;
	estatusID?: number | null;
};
type Reservation = { id: number; estatusID: number };
type User = {
	id?: number | string | null;
	userId?: number | string | null;
	userID?: number | string | null;
	name?: string | null;
	nombre?: string | null;
	status?: string | null;
};
type Tournament = { id: number; status: string };

function unwrapArray<T>(response: any): T[] {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response?.data)) return response.data;
	if (Array.isArray(response?.result)) return response.result;
	return [];
}

function resolveUserId(user: User | null | undefined) {
	return user?.id ?? user?.userId ?? user?.userID ?? null;
}

function resolveUserName(user: User | null | undefined) {
	return user?.name ?? user?.nombre ?? "";
}

export async function getDashboardData() {
	if (!isApiConfigured) {
		return {
			stats: [
				{ title: "Instalaciones registradas", value: 0 },
				{ title: "Reservas activas", value: 0 },
				{ title: "Usuarios registrados", value: 0 },
				{ title: "Torneos en curso", value: 0 },
			],
			activity: [],
			classification: [],
			maintenances: [],
			currentUserName: "",
		};
	}

	try {
		const [
			facilitiesRes,
			reservationsRes,
			usersRes,
			tournamentsRes,
			maintenances,
		] = await Promise.all([
			apiFetchJson("/api/Facility/GetAllFacilitiesAsyncFront"),
			apiFetchJson("/api/Reservation/GetAllReservationsFront"),
			apiFetchJson("/api/User/GetAllUsersIndex"),
			apiFetchJson("/api/Tournaments/GetAllTournamentsFront"),
			getMaintenances(),
		]);

		const facilities = unwrapArray<Facility>(facilitiesRes);
		const reservations = unwrapArray<Reservation>(reservationsRes);
		const users = unwrapArray<User>(usersRes);
		const tournaments = unwrapArray<Tournament>(tournamentsRes);
		const session = getSession();
		const sessionUserId = session?.userID ?? null;
		const currentUserName =
			sessionUserId !== null
				? resolveUserName(
					users.find(
						(user) =>
							String(resolveUserId(user) ?? "") ===
							String(sessionUserId),
					),
				)
				: "";

		const totalReservations = reservations.length;
		const activeReservations = reservations.filter(r => r.estatusID === 1).length;
		const reservationsPct = totalReservations
			? Math.round((activeReservations / totalReservations) * 100)
			: 0;

		const totalFacilities = facilities.length;
		const availableFacilities = facilities.filter((facility) => {
			const raw = facility.status;
			if (typeof raw === "string") {
				const normalized = raw.trim().toLowerCase();
				if (normalized === "activo") return true;
				const asNumber = Number(normalized);
				if (!Number.isNaN(asNumber)) return asNumber === 1;
			}
			if (typeof raw === "number") return raw === 1;
			if (typeof facility.status_ID === "number") return facility.status_ID === 1;
			if (typeof facility.estatusID === "number") return facility.estatusID === 1;
			return false;
		}).length;
		const facilitiesPct = totalFacilities
			? Math.round((availableFacilities / totalFacilities) * 100)
			: 0;

		const totalTournaments = tournaments.length;
		const activeTournaments = tournaments.filter(
			t => t.status === "Activo"
		).length;
		const tournamentsPct = totalTournaments
			? Math.round((activeTournaments / totalTournaments) * 100)
			: 0;

		const facilityStatusCount = {
			Activo: 0,
			Inactivo: 0,
			"En Mantenimiento": 0,
			Reservado: 0,
		};

		facilities.forEach((facility) => {
			const status = Number(facility.status ?? facility.status_ID ?? facility.estatusID);

			switch (status) {
				case 1:
					facilityStatusCount.Activo++;
					break;
				case 2:
					facilityStatusCount.Inactivo++;
					break;
				case 3:
					facilityStatusCount["En Mantenimiento"]++;
					break;
				case 4:
					facilityStatusCount.Reservado++;
					break;
				default:
					break;
			}
		});

		const dashboardMaintenances = maintenances
			.filter(
				(m) => m.estadoId === 1 || m.estadoId === 3
			)
			.sort(
				(a, b) =>
					new Date(a.inicio).getTime() -
					new Date(b.inicio).getTime()
			)
			.slice(0, 5);

		return {
			stats: [
				{
					title: "Instalaciones registradas",
					value: totalFacilities,
				},
				{
					title: "Reservas activas",
					value: activeReservations,
				},
				{
					title: "Usuarios registrados",
					value: users.length,
				},
				{
					title: "Torneos en curso",
					value: activeTournaments,
				},
			],

			activity: [
				{
					name: "Reservas activas",
					value: reservationsPct,
					color: "#3366CC",
				},
				{
					name: "Instalaciones disponibles",
					value: facilitiesPct,
					color: "#16A34A",
				},
				{
					name: "Torneos activos",
					value: tournamentsPct,
					color: "#7C3AED",
				},
			],

			classification: [
				{ name: "Activo", value: facilityStatusCount.Activo },
				{ name: "Inactivo", value: facilityStatusCount.Inactivo },
				{
					name: "En Mantenimiento",
					value: facilityStatusCount["En Mantenimiento"],
				},
				{ name: "Reservado", value: facilityStatusCount.Reservado },
			].filter(item => item.value > 0),
			maintenances: dashboardMaintenances,
			currentUserName,
		};
	} catch (error) {
		console.error("Error loading dashboard data, using fallback", error);
		return {
			stats: [
				{ title: "Instalaciones registradas", value: 0 },
				{ title: "Reservas activas", value: 0 },
				{ title: "Usuarios registrados", value: 0 },
				{ title: "Torneos en curso", value: 0 },
			],
			activity: [],
			classification: [],
			maintenances: [],
			currentUserName: "",
		};
	}
}
