// src/components/TorneoModal.jsx
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

export default function TorneoModal({
	open,
	onClose,
	onSave,
	initialData = null,
	installations = [],
}) {
	const emptyForm = useMemo(
		() => ({
			nombre: "",
			categoriaId: "",
			disciplinaId: "",
			estadoId: "",
			facilityId: "",
			fechaIso: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (open && initialData) {
			setForm({
				nombre: initialData.nombre ?? "",
				categoriaId:
					initialData.categoriaId === null || initialData.categoriaId === undefined
						? ""
						: String(initialData.categoriaId),
				disciplinaId:
					initialData.disciplinaId === null || initialData.disciplinaId === undefined
						? ""
						: String(initialData.disciplinaId),
				estadoId:
					initialData.estadoId === null || initialData.estadoId === undefined
						? ""
						: String(initialData.estadoId),
				facilityId:
					initialData.facilityId === null || initialData.facilityId === undefined
						? ""
						: String(initialData.facilityId),
				fechaIso: formatDateTimeLocal(initialData.fechaIso),
			});
			setErrors({});
		} else if (open) {
			setForm(emptyForm);
			setErrors({});
		} else {
			setForm(emptyForm);
			setErrors({});
		}
	}, [open, initialData, emptyForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		const nextErrors = {};
		const date = form.fechaIso ? new Date(form.fechaIso) : null;

		const categoriaNum = form.categoriaId === "" ? NaN : Number(form.categoriaId);
		const disciplinaNum = form.disciplinaId === "" ? NaN : Number(form.disciplinaId);
		const estadoNum = form.estadoId === "" ? NaN : Number(form.estadoId);
		const facilityNum = form.facilityId === "" ? NaN : Number(form.facilityId);

		if (!form.nombre.trim()) {
			nextErrors.nombre = "Ingresa un nombre";
		}
		if (!Number.isFinite(categoriaNum) || categoriaNum <= 0) {
			nextErrors.categoriaId = "Ingresa un categoryID válido";
		}
		if (!Number.isFinite(disciplinaNum) || disciplinaNum <= 0) {
			nextErrors.disciplinaId = "Ingresa un disciplineID válido";
		}
		if (!Number.isFinite(estadoNum) || estadoNum <= 0) {
			nextErrors.estadoId = "Ingresa un estatusID válido";
		}
		if (!Number.isFinite(facilityNum) || facilityNum <= 0) {
			nextErrors.facilityId = "Selecciona una instalación válida";
		}
		if (!date || Number.isNaN(date.getTime())) {
			nextErrors.fechaIso = "Ingresa una fecha válida";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		onSave?.({
			id: initialData?.id,
			nombre: form.nombre.trim(),
			categoriaId: categoriaNum,
			disciplinaId: disciplinaNum,
			estadoId: estadoNum,
			facilityId: facilityNum,
			fechaIso: date.toISOString(),
		});
		onClose?.();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{initialData ? "Editar Torneo" : "Nuevo Torneo"}</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2} sx={{ mt: 0.5 }}>
					<Grid item xs={12}>
						<TextField
							label="Nombre"
							name="nombre"
							fullWidth
							value={form.nombre}
							onChange={handleChange}
							required
							error={Boolean(errors.nombre)}
							helperText={errors.nombre}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Categoría (categoryID)"
							name="categoriaId"
							type="number"
							fullWidth
							value={form.categoriaId}
							onChange={handleChange}
							required
							error={Boolean(errors.categoriaId)}
							helperText={errors.categoriaId}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Disciplina (disciplineID)"
							name="disciplinaId"
							type="number"
							fullWidth
							value={form.disciplinaId}
							onChange={handleChange}
							required
							error={Boolean(errors.disciplinaId)}
							helperText={errors.disciplinaId}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Estado (estatusID)"
							name="estadoId"
							type="number"
							fullWidth
							value={form.estadoId}
							onChange={handleChange}
							required
							error={Boolean(errors.estadoId)}
							helperText={errors.estadoId}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							select
							label="Instalación"
							name="facilityId"
							fullWidth
							value={form.facilityId}
							onChange={handleChange}
							required
							error={Boolean(errors.facilityId)}
							helperText={errors.facilityId}
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
							label="Fecha"
							name="fechaIso"
							type="datetime-local"
							fullWidth
							value={form.fechaIso}
							onChange={handleChange}
							required
							InputLabelProps={{ shrink: true }}
							error={Boolean(errors.fechaIso)}
							helperText={errors.fechaIso}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="inherit">
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit}>
					{initialData ? "Guardar cambios" : "Crear Torneo"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
