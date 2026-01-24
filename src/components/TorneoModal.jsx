import React, { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	MenuItem,
	Alert,
	Box,
} from "@mui/material";

function formatDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const pad = (n) => n.toString().padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function TorneoModal({
	open,
	onClose,
	onSave,
	initialData = null,
	viewModel = { categories: [], disciplines: [], estatus: [], facilities: [], encargados: [], users: [] },
}) {
	const emptyForm = useMemo(
		() => ({
			nombre: "",
			descripcion: "",
			normas: "",
			categoriaId: "",
			disciplinaId: "",
			estadoId: "",
			facilityId: "",
			supervisorId: "",
			usuarioId: "",
			fechaIso: "",
			endFechaIso: "",
		}),
		[]
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [submitError, setSubmitError] = useState("");


	useEffect(() => {
		if (open && initialData) {
			let usuarioId = "";

			if (initialData.usuarioId !== null && initialData.usuarioId !== undefined) {
				usuarioId = String(initialData.usuarioId);
			}
			else if (initialData.usuario && Array.isArray(viewModel.users)) {
				const match = viewModel.users.find(
					(u) =>
						u.name &&
						u.name.toLowerCase() === String(initialData.usuario).toLowerCase(),
				);
				if (match) {
					usuarioId = String(match.id);
				}
			}

			setForm({
				nombre: initialData.nombre ?? "",
				descripcion: initialData.descripcion ?? "",
				normas: initialData.normas ?? "",
				categoriaId: initialData.categoriaId ? String(initialData.categoriaId) : "",
				disciplinaId: initialData.disciplinaId ? String(initialData.disciplinaId) : "",
				estadoId: initialData.estadoId ? String(initialData.estadoId) : "",
				facilityId: initialData.facilityId ? String(initialData.facilityId) : "",
				supervisorId: initialData.supervisorId ? String(initialData.supervisorId) : "",
				usuarioId,
				fechaIso: formatDateTimeLocal(initialData.fechaIso),
				endFechaIso: formatDateTimeLocal(initialData.endFechaIso),
			});
			setErrors({});
			setSubmitError("");
		} else if (open && !initialData) {
			setForm(emptyForm);
			setErrors({});
			setSubmitError("");
		} else if (!open) {
			setForm(emptyForm);
			setErrors({});
			setSubmitError("");
		}
	}, [open, initialData, emptyForm, viewModel.users]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const nextErrors = {};
		const date = form.fechaIso ? new Date(form.fechaIso) : null;
		const endDate = form.endFechaIso ? new Date(form.endFechaIso) : null;

		const categoriaNum = form.categoriaId === "" ? NaN : Number(form.categoriaId);
		const disciplinaNum = form.disciplinaId === "" ? NaN : Number(form.disciplinaId);
		const estadoNum = form.estadoId === "" ? NaN : Number(form.estadoId);
		const facilityNum = form.facilityId === "" ? NaN : Number(form.facilityId);
		const supervisorNum = form.supervisorId === "" ? NaN : Number(form.supervisorId);
		const usuarioNum = form.usuarioId === "" ? NaN : Number(form.usuarioId);

		if (!form.nombre.trim()) nextErrors.nombre = "Ingresa un nombre";
		if (!form.descripcion?.trim()) nextErrors.descripcion = "Ingresa una descripción";
		if (!form.normas?.trim()) nextErrors.normas = "Ingresa las normas";
		if (!Number.isFinite(categoriaNum) || categoriaNum <= 0) nextErrors.categoriaId = "Selecciona una categoría válida";
		if (!Number.isFinite(disciplinaNum) || disciplinaNum <= 0) nextErrors.disciplinaId = "Selecciona una disciplina válida";
		if (!Number.isFinite(estadoNum) || estadoNum <= 0) nextErrors.estadoId = "Selecciona un estado válido";
		if (!Number.isFinite(facilityNum) || facilityNum <= 0) nextErrors.facilityId = "Selecciona una instalación válida";
		if (!Number.isFinite(supervisorNum) || supervisorNum <= 0) nextErrors.supervisorId = "Selecciona un encargado válido";
		if (!Number.isFinite(usuarioNum) || usuarioNum <= 0) nextErrors.usuarioId = "Ingresa un usuario válido";

		if (!date || Number.isNaN(date.getTime())) {
			nextErrors.fechaIso = "Ingresa una fecha válida";
		}
		if (!endDate || Number.isNaN(endDate.getTime())) {
			nextErrors.endFechaIso = "Ingresa una fecha fin válida";
		} else if (date && !Number.isNaN(date.getTime()) && endDate.getTime() <= date.getTime()) {
			nextErrors.endFechaIso = "La fecha fin debe ser mayor que la fecha inicio";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		setSubmitError("");

		try {
			await onSave?.({
				id: initialData?.id,
				nombre: form.nombre.trim(),
				descripcion: form.descripcion.trim(),
				normas: form.normas.trim(),
				categoriaId: Number(form.categoriaId),
				disciplinaId: Number(form.disciplinaId),
				estadoId: Number(form.estadoId),
				facilityId: Number(form.facilityId),
				supervisorId: Number(form.supervisorId),
				usuarioId: usuarioNum,
				fechaIso: date.toISOString(),
				endFechaIso: endDate.toISOString(),
			});

			onClose?.();
		} catch (error) {
			console.error("Error saving tournament", error);
			const message =
				error instanceof Error
					? error.message
					: "No se pudo guardar el torneo. Intenta de nuevo.";
			setSubmitError(message);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				{initialData ? "Editar Torneo" : "Nuevo Torneo"}
			</DialogTitle>

			<DialogContent
				sx={{
					pt: 1.5,
					px: 4,
					pb: 2,
				}}
			>
				<Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
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

					<TextField
						label="Descripción"
						name="descripcion"
						fullWidth
						multiline
						minRows={2}
						value={form.descripcion}
						onChange={handleChange}
						required
						error={Boolean(errors.descripcion)}
						helperText={errors.descripcion}
					/>

					<TextField
						label="Normas"
						name="normas"
						fullWidth
						multiline
						minRows={2}
						value={form.normas}
						onChange={handleChange}
						required
						error={Boolean(errors.normas)}
						helperText={errors.normas}
					/>

					<TextField
						select
						label="Categoría"
						name="categoriaId"
						fullWidth
						required
						value={form.categoriaId}
						onChange={handleChange}
						error={Boolean(errors.categoriaId)}
						helperText={errors.categoriaId}
					>
						{viewModel.categories.map((c) => (
							<MenuItem key={c.id} value={c.id}>
								{c.descripcion}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Disciplina"
						name="disciplinaId"
						fullWidth
						required
						value={form.disciplinaId}
						onChange={handleChange}
						error={Boolean(errors.disciplinaId)}
						helperText={errors.disciplinaId}
					>
						{viewModel.disciplines.map((d) => (
							<MenuItem key={d.id} value={d.id}>
								{d.descripcion}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Estado"
						name="estadoId"
						fullWidth
						required
						value={form.estadoId}
						onChange={handleChange}
						error={Boolean(errors.estadoId)}
						helperText={errors.estadoId}
					>
						{viewModel.estatus.map((e) => (
							<MenuItem key={e.estatusID} value={e.estatusID} disabled={Boolean(initialData) && ["2"].includes(String(e.estatusID))}>
								{e.descripcion}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Instalación"
						name="facilityId"
						fullWidth
						required
						value={form.facilityId}
						onChange={handleChange}
						error={Boolean(errors.facilityId)}
						helperText={errors.facilityId}
					>
						{viewModel.facilities.map((f) => (
							<MenuItem key={f.id} value={f.id}>
								{f.name}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Encargado"
						name="supervisorId"
						fullWidth
						required
						value={form.supervisorId}
						onChange={handleChange}
						error={Boolean(errors.supervisorId)}
						helperText={errors.supervisorId}
					>
						{viewModel.encargados.map((p) => (
							<MenuItem key={p.id} value={p.id}>
								{p.fullName}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Usuario"
						name="usuarioId"
						fullWidth
						required
						value={form.usuarioId}
						onChange={handleChange}
						error={Boolean(errors.usuarioId)}
						helperText={errors.usuarioId}
					>
						<MenuItem value="">Selecciona</MenuItem>
						{(viewModel.users ?? []).map((u) => (
							<MenuItem key={u.id} value={String(u.id)}>
								{u.name} ({u.email})
							</MenuItem>
						))}
					</TextField>

					<TextField
						label="Fecha"
						name="fechaIso"
						type="datetime-local"
						fullWidth
						required
						value={form.fechaIso}
						onChange={handleChange}
						InputLabelProps={{ shrink: true }}
						error={Boolean(errors.fechaIso)}
						helperText={errors.fechaIso}
					/>

					<TextField
						label="Fecha fin"
						name="endFechaIso"
						type="datetime-local"
						fullWidth
						required
						value={form.endFechaIso}
						onChange={handleChange}
						InputLabelProps={{ shrink: true }}
						error={Boolean(errors.endFechaIso)}
						helperText={errors.endFechaIso}
					/>

					{submitError ? (
						<Alert severity="error">
							{submitError}
						</Alert>
					) : null}
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
				<Button onClick={onClose} color="inherit">
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 160 }}>
					{initialData ? "Guardar cambios" : "Crear Torneo"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
