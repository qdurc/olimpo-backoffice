import { apiFetchJson } from "./http";
import { clearSession, getSession, setSession } from "./session";

export type LoginRequest = {
	email: string;
	password: string;
};

type LoginApiResponse =
	| {
			token?: string | null;
			userID?: number | string | null;
	  }
	| {
			data?: {
				tokenID?: string | null;
				userID?: number | string | null;
			} | null;
			success?: boolean;
			message?: string | null;
			errors?: unknown[];
	  };

export type LoginResponse = {
	token: string;
	userID?: number | string;
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
	const response = await apiFetchJson<LoginApiResponse>("/api/Auth/LoginAdmin", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	const responseObj = typeof response === "object" && response !== null ? response : {};

	const token =
		(responseObj as any).token ??
		(responseObj as any).tokenID ??
		(responseObj as any).data?.tokenID ??
		(responseObj as any).data?.token;

	if (!token) {
		const message =
			typeof (responseObj as any).message === "string"
				? (responseObj as any).message
				:
			"Credenciales inválidas. Verifica tu correo y contraseña.";

		throw new Error(message);
	}

	const userID =
		(responseObj as any).userID ?? (responseObj as any).data?.userID ?? undefined;

	const session = { token: String(token), userID: userID ?? undefined };
	setSession(session);

	return session;
}

export function logout(): void {
	clearSession();
}

export function getSavedSession() {
	return getSession();
}
