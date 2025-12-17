import {
	dashboardClassificationData,
	upcomingEvents,
} from "../mocks/dashboard";
import { apiFetchJson, isApiConfigured } from "./http";

type Facility = { id: number; status: string };
type Reservation = { id: number; estatusID: number };
type User = { userId: number; status: string };
type Tournament = { id: number; status: string };

function unwrapArray<T>(response: any): T[] {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response?.data)) return response.data;
	if (Array.isArray(response?.result)) return response.result;
	return [];
}

const fallback = {
	classification: dashboardClassificationData,
	events: upcomingEvents,
};

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
			...fallback,
		};
	}

	try {
		const [
			facilitiesRes,
			reservationsRes,
			usersRes,
			tournamentsRes,
		] = await Promise.all([
			apiFetchJson("/api/Facility/GetAllFacilitiesAsyncFront"),
			apiFetchJson("/api/Reservation/GetAllReservationsFront"),
			apiFetchJson("/api/User/GetAllUsersIndex"),
			apiFetchJson("/api/Tournaments/GetAllTournamentsFront"),
		]);

		const facilities = unwrapArray<Facility>(facilitiesRes);
		const reservations = unwrapArray<Reservation>(reservationsRes);
		const users = unwrapArray<User>(usersRes);
		const tournaments = unwrapArray<Tournament>(tournamentsRes);

		const totalReservations = reservations.length;
		const activeReservations = reservations.filter(r => r.estatusID === 1).length;
		const reservationsPct = totalReservations
			? Math.round((activeReservations / totalReservations) * 100)
			: 0;

		const totalFacilities = facilities.length;
		const availableFacilities = facilities.filter(
			f => f.status === "Activo"
		).length;
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

			...fallback,
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
			...fallback,
		};
	}
}
