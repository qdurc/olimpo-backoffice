import * as React from "react";
import { Chip } from "@mui/material";

const primaryBg = "rgba(0,32,91,0.12)";
const supportBg = "rgba(51,102,204,0.12)";
const alertBg = "rgba(237,28,36,0.12)";

const map: Record<string, { bg: string; color: string; label?: string }> = {
	"Disponible": { bg: primaryBg, color: "#00205B" },
	"Resuelto": { bg: primaryBg, color: "#00205B" },
	"Aprobada": { bg: primaryBg, color: "#00205B" },
	"Abierto": { bg: primaryBg, color: "#00205B" },
	"En Proceso": { bg: supportBg, color: "#3366CC" },
	"Pendiente": { bg: supportBg, color: "#3366CC" },
	"En Curso": { bg: supportBg, color: "#3366CC" },
	"Mantenimiento": { bg: supportBg, color: "#3366CC" },
	"Correctivo": { bg: supportBg, color: "#3366CC" },
	"Preventivo": { bg: supportBg, color: "#3366CC" },
	"Bloqueada": { bg: alertBg, color: "#ED1C24" },
	"Cancelada": { bg: alertBg, color: "#ED1C24" },
	"Rechazada": { bg: alertBg, color: "#ED1C24" },
	"Finalizado": { bg: primaryBg, color: "#00205B" },
};

export default function StatusPill({ value }: { value: string }) {
	const s = map[value] ?? { bg: primaryBg, color: "#00205B" };
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
