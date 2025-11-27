import React, { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	MenuItem,
} from "@mui/material";

function formatDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().slice(0, 16);
}

export default function MaintenanceModal({
	open,
	onClose,
	onSave,
	installations = [],
	initialData = null,
}) {
	const emptyForm = useMemo(
		() => ({
			facilityId: "",
			descripcion: "",
			inicio: "",
			fin: "",
			usuarioId: "",
			estadoId: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);

	useEffect(() => {
		if (open && initialData) {
			setForm({
				facilityId: initialData.facilityId ?? "",
				descripcion: initialData.descripcion ?? "",
				inicio: formatDateTimeLocal(initialData.inicio),
				fin: formatDateTimeLocal(initialData.fin),
				usuarioId:
					initialData.usuarioId === null || initialData.usuarioId === undefined
						? ""
						: String(initialData.usuarioId),
				estadoId:
					initialData.estadoId === null || initialData.estadoId === undefined
						? ""
						: String(initialData.estadoId),
			});
		} else if (!open) {
			setForm(emptyForm);
		}
	}, [open, initialData, emptyForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		if (!form.facilityId) return;

		onSave?.({
			...form,
			id: initialData?.id,
			usuarioId: form.usuarioId === "" ? null : form.usuarioId,
			estadoId: form.estadoId === "" ? null : form.estadoId,
			inicio: form.inicio ? new Date(form.inicio).toISOString() : "",
			fin: form.fin ? new Date(form.fin).toISOString() : "",
		});

		setForm(emptyForm);
		onClose?.();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
				{initialData ? "Editar mantenimiento" : "Nuevo mantenimiento"}
			</DialogTitle>

			<DialogContent
				sx={{
					pt: 2,
					px: 3,
					pb: 2,
					"& .MuiTextField-root": { mt: 1 },
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							select
							label="Instalación"
							name="facilityId"
							fullWidth
							value={form.facilityId}
							onChange={handleChange}
						>
							{installations.map((inst) => (
								<MenuItem key={inst.id} value={inst.id}>
									{inst.nombre}
								</MenuItem>
							))}
						</TextField>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Descripción"
							name="descripcion"
							fullWidth
							multiline
							minRows={2}
							value={form.descripcion}
							onChange={handleChange}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Inicio"
							name="inicio"
							type="datetime-local"
							fullWidth
							value={form.inicio}
							onChange={handleChange}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Fin"
							name="fin"
							type="datetime-local"
							fullWidth
							value={form.fin}
							onChange={handleChange}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Usuario ID"
							name="usuarioId"
							type="number"
							fullWidth
							value={form.usuarioId}
							onChange={handleChange}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Estado (estatusID)"
							name="estadoId"
							type="number"
							fullWidth
							value={form.estadoId}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant="contained" onClick={handleSubmit}>
					{initialData ? "Guardar cambios" : "Agregar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
