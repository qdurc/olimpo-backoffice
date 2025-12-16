const TOKEN_KEY = "olimpo_token";
const USER_ID_KEY = "olimpo_user_id";

type Session = {
	token: string;
	userID?: number | string;
};

const hasStorage = () => typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export function getSession(): Session | null {
	if (!hasStorage()) return null;

	const token = window.sessionStorage.getItem(TOKEN_KEY);
	const userID = window.sessionStorage.getItem(USER_ID_KEY) ?? undefined;

	if (!token) return null;
	return { token, userID };
}

export function setSession(session: Session): void {
	if (!hasStorage()) return;
	window.sessionStorage.setItem(TOKEN_KEY, session.token);

	if (session.userID !== undefined) {
		window.sessionStorage.setItem(USER_ID_KEY, String(session.userID));
	} else {
		window.sessionStorage.removeItem(USER_ID_KEY);
	}
}

export function clearSession(): void {
	if (!hasStorage()) return;
	window.sessionStorage.removeItem(TOKEN_KEY);
	window.sessionStorage.removeItem(USER_ID_KEY);
}

export function hasSession(): boolean {
	return Boolean(getSession()?.token);
}
