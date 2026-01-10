import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	CircularProgress,
	Divider,
} from "@mui/material";

export default function UserHistoryModal({
	open,
	onClose,
	user,
	loading,
	error,
	items = [],
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				Historial de participación{user?.nombre ? ` — ${user.nombre}` : ""}
			</DialogTitle>

			<DialogContent sx={{ px: 4, pb: 2 }}>
				{loading ? (
					<Box display="flex" justifyContent="center" py={4}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Typography color="error" sx={{ mt: 1 }}>
						{error}
					</Typography>
				) : items.length === 0 ? (
					<Typography sx={{ mt: 1 }}>
						Este usuario no tiene torneos registrados en su historial.
					</Typography>
				) : (
					<Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
						{items.map((t, idx) => (
							<Box key={`${t.name}-${idx}`} sx={{ py: 1 }}>
								<Typography sx={{ fontWeight: 700 }}>{t.name}</Typography>
								<Typography variant="body2" color="text.secondary">
									Disciplina: {t.discipline} • Categoría: {t.category}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Instalación: {t.facility} • Supervisor: {t.supervisor}
								</Typography>
								<Typography variant="body2" sx={{ mt: 0.5 }}>
									Estado: {t.estatus}
								</Typography>
								{idx < items.length - 1 ? <Divider sx={{ mt: 2 }} /> : null}
							</Box>
						))}
					</Box>
				)}
			</DialogContent>

			<DialogActions sx={{ px: 4, pb: 3 }}>
				<Button onClick={onClose} color="inherit">
					Cerrar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
