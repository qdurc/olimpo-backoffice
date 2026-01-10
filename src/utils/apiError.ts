type ApiErrorShape = {
	success?: boolean;
	message?: unknown;
	errors?: unknown;
	data?: unknown;
};

function isApiErrorShape(x: unknown): x is ApiErrorShape {
	return typeof x === "object" && x !== null && ("errors" in x || "message" in x || "success" in x);
}

function stringifyUnknown(x: unknown) {
	if (typeof x === "string") return x;
	if (x instanceof Error) return x.message;
	try {
		return JSON.stringify(x);
	} catch {
		return String(x);
	}
}

function pickMessagesFromErrors(errors: unknown): string[] {
	if (!errors) return [];
	if (Array.isArray(errors)) {
		return errors
			.map((e) => (typeof e === "string" ? e : stringifyUnknown(e)))
			.filter(Boolean);
	}
	if (typeof errors === "string") return [errors];
	return [stringifyUnknown(errors)];
}

export function extractBackendError(err: unknown, fallback = "Ocurrió un error. Intenta de nuevo.") {
	if (err instanceof Error && !isApiErrorShape((err as any)?.cause)) {
	}

	// caso: el caller nos pasa directamente el JSON del backend 
	if (isApiErrorShape(err)) {
		const list = pickMessagesFromErrors(err.errors);
		if (list.length) return new Error(list.join("\n"));
		if (typeof err.message === "string" && err.message.trim()) return new Error(err.message);
		return new Error(fallback);
	}

	// caso: error.message contiene JSON 
	if (err instanceof Error) {
		const msg = err.message?.trim();
		if (msg) {
			try {
				const parsed = JSON.parse(msg);
				if (isApiErrorShape(parsed)) {
					const list = pickMessagesFromErrors(parsed.errors);
					if (list.length) return new Error(list.join("\n"));
					if (typeof parsed.message === "string" && parsed.message.trim()) return new Error(parsed.message);
				}
			} catch {
			}
			return new Error(msg);
		}
	}

	return new Error(fallback);
}
