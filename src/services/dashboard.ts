import {
	dashboardStats,
	dashboardActivityData,
	dashboardClassificationData,
	upcomingEvents,
} from "../mocks/dashboard";
import { apiFetchJson, isApiConfigured } from "./http";

const fallback = {
	stats: dashboardStats,
	activity: dashboardActivityData,
	classification: dashboardClassificationData,
	events: upcomingEvents,
};

type DashboardResponse = Partial<typeof fallback>;

export async function getDashboardData() {
	if (!isApiConfigured) {
		return fallback;
	}

	try {
		const data = await apiFetchJson<DashboardResponse>("/dashboard");
		return {
			stats: data?.stats ?? fallback.stats,
			activity: data?.activity ?? fallback.activity,
			classification: data?.classification ?? fallback.classification,
			events: data?.events ?? fallback.events,
		};
	} catch (error) {
		console.warn("Falling back to mock dashboard data", error);
		return fallback;
	}
}
