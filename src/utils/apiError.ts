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

function cleanValidationMessage(raw: string): string {
	if (!raw) return raw;

	let msg = raw.trim();

	msg = msg.replace(/^Validation failed:\s*/i, "").trim();

	const parts = msg.split(/--\s*/).map((p) => p.trim()).filter(Boolean);
	if (!parts.length) return msg || raw;

	const cleanedParts = parts.map((p) => {
		const severityIndex = p.toLowerCase().indexOf("severity:");
		if (severityIndex !== -1) {
			p = p.slice(0, severityIndex).trim();
		}
		return p;
	});

	return cleanedParts.join("\n");
}

export function extractBackendError(
	err: unknown,
	fallback = "Ocurrió un error. Intenta de nuevo.",
) {
	if (isApiErrorShape(err)) {
		const list = pickMessagesFromErrors(err.errors);
		if (list.length) {
			const cleaned = list.map((m) => cleanValidationMessage(m));
			return new Error(cleaned.join("\n"));
		}
		if (typeof err.message === "string" && err.message.trim()) {
			return new Error(cleanValidationMessage(err.message));
		}
		return new Error(fallback);
	}

	if (err instanceof Error) {
		const msg = err.message?.trim();
		if (msg) {
			try {
				const parsed = JSON.parse(msg);
				if (isApiErrorShape(parsed)) {
					const list = pickMessagesFromErrors(parsed.errors);
					if (list.length) {
						const cleaned = list.map((m) => cleanValidationMessage(m));
						return new Error(cleaned.join("\n"));
					}
					if (typeof parsed.message === "string" && parsed.message.trim()) {
						return new Error(cleanValidationMessage(parsed.message));
					}
				}
			} catch {
			}

			return new Error(cleanValidationMessage(msg));
		}
	}

	return new Error(fallback);
}
