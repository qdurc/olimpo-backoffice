import * as React from "react";
import { Chip } from "@mui/material";

const map: Record<string, { bg: string; color: string; label?: string }> = {
	"Disponible": { bg: "rgba(16,185,129,.12)", color: "#059669" },
	"Resuelto": { bg: "rgba(16,185,129,.12)", color: "#059669" },
	"En Proceso": { bg: "rgba(251,146,60,.12)", color: "#F59E0B" },
	"Pendiente": { bg: "rgba(251,146,60,.12)", color: "#EF4444" },
	"Mantenimiento": { bg: "rgba(248,113,113,.12)", color: "#F59E0B" },
	"Bloqueada": { bg: "rgba(248,113,113,.12)", color: "#EF4444" },
	"Correctivo": { bg: "rgba(59,130,246,.12)", color: "#1D4ED8" },
	"Preventivo": { bg: "rgba(59,130,246,.12)", color: "#1D4ED8" },
	"Aprobada": { bg: "rgba(16,185,129,.12)", color: "#059669" },
	"Cancelada": { bg: "rgba(239,68,68,.12)", color: "#DC2626" },
	"Rechazada": { bg: "rgba(239,68,68,.12)", color: "#DC2626" },
};

export default function StatusPill({ value }: { value: string }) {
	const s = map[value] ?? { bg: "rgba(148,163,184,.15)", color: "#475569" };
	return (
		<Chip
			label={value}
			size="small"
			sx={{
				bgcolor: s.bg,
				color: s.color,
				borderRadius: 1.5,
				fontWeight: 600,
				height: 24,
			}}
		/>
	);
}
