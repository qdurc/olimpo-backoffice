import {
	dashboardActivityData,
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
	activity: dashboardActivityData,
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

		return {
			stats: [
				{
					title: "Instalaciones registradas",
					value: facilities.length,
				},
				{
					title: "Reservas activas",
					value: reservations.filter(r => r.estatusID === 1).length,
				},
				{
					title: "Usuarios registrados",
					value: users.length,
				},
				{
					title: "Torneos en curso",
					value: tournaments.filter(t => t.status === "Activo").length,
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
			...fallback,
		};
	}
}
