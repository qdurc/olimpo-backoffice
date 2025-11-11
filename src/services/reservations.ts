import { reservationsMock } from "../mocks/reservations";
import { apiFetchJson, isApiConfigured } from "./http";

export async function getReservations() {
	if (!isApiConfigured) {
		return reservationsMock;
	}

	try {
		return await apiFetchJson("/reservations");
	} catch (error) {
		console.warn("Falling back to mock reservations data", error);
		return reservationsMock;
	}
}
