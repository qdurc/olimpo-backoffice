import { apiFetchJson } from "./http";

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	token: string;
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
	return apiFetchJson<LoginResponse>("/api/Auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
