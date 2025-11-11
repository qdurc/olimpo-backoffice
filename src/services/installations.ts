import { v4 as uuidv4 } from "uuid";
import {
	installationsMock,
	installationReportsMock,
} from "../mocks/installations";
import { apiFetchJson, isApiConfigured } from "./http";

export async function getInstallations() {
	if (!isApiConfigured) {
		return installationsMock;
	}

	try {
		return await apiFetchJson("/installations");
	} catch (error) {
		console.warn("Falling back to mock installations data", error);
		return installationsMock;
	}
}

export async function getInstallationReports() {
	if (!isApiConfigured) {
		return installationReportsMock;
	}

	try {
		return await apiFetchJson("/installation-reports");
	} catch (error) {
		console.warn("Falling back to mock installation reports", error);
		return installationReportsMock;
	}
}

export async function createInstallation(payload: Record<string, unknown>) {
	if (!isApiConfigured) {
		return { id: uuidv4(), ...payload };
	}

	try {
		return await apiFetchJson("/installations", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	} catch (error) {
		console.warn("Create installation failed, using mock response", error);
		return { id: uuidv4(), ...payload };
	}
}
