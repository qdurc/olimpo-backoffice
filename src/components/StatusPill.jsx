import * as React from "react";
import { Chip } from "@mui/material";

const primaryBg = "rgba(0,32,91,0.12)";
const successBg = "rgba(22,163,74,0.12)";
const successColor = "#16a34a";
const alertBg = "rgba(220,38,38,0.12)";
const alertColor = "#dc2626";
const warningBg = "rgba(234,179,8,0.18)";
const warningColor = "#b45309";
const infoBg = "rgba(51,102,204,0.12)";
const infoColor = "#3366CC";

const map = {
	Activo: { bg: successBg, color: successColor },
	Inactivo: { bg: alertBg, color: alertColor },
	"En Mantenimiento": { bg: warningBg, color: warningColor },
	Reservado: { bg: infoBg, color: infoColor },
};

export default function StatusPill({ value }) {
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
