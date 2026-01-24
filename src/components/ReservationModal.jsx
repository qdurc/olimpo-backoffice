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
import { extractBackendError } from "../utils/apiError";

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

export default function ReservationModal({
	open,
	onClose,
	onSave,
	installations = [],
	statuses = [],
	users = [],
	initialData = null,
}) {
	const emptyForm = useMemo(
		() => ({
			facilityId: "",
			usuarioId: "",
			fechaIso: "",
			endFechaIso: "",
			estadoId: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [submitError, setSubmitError] = useState("");

	useEffect(() => {
		if (open && initialData) {
			setForm({
				facilityId: initialData.facilityId ?? "",
				usuarioId:
					initialData.usuarioId === null || initialData.usuarioId === undefined
						? ""
						: String(initialData.usuarioId),
				fechaIso: formatDateTimeLocal(initialData.fechaIso),
				endFechaIso: formatDateTimeLocal(initialData.endFechaIso),
				estadoId:
					initialData.estadoId === null || initialData.estadoId === undefined
						? ""
						: String(initialData.estadoId),
			});
			setErrors({});
			setSubmitError("");
		} else if (open && !initialData) {
			const defaultStatus =
				statuses.find((s) => s.id === 1)?.id?.toString?.() ||
				statuses[0]?.id?.toString?.() ||
				"";
			setForm({ ...emptyForm, estadoId: defaultStatus });
			setErrors({});
			setSubmitError("");
		} else if (!open) {
			setForm(emptyForm);
			setErrors({});
			setSubmitError("");
		}
	}, [open, initialData, emptyForm, statuses]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const nextErrors = {};
		const date = form.fechaIso ? new Date(form.fechaIso) : null;
		const endDate = form.endFechaIso ? new Date(form.endFechaIso) : null;
		const facilityIdNum = form.facilityId === "" ? NaN : Number(form.facilityId);
		const userIdNum = form.usuarioId === "" ? NaN : Number(form.usuarioId);
		const estadoIdNum = form.estadoId === "" ? NaN : Number(form.estadoId);

		if (!Number.isFinite(facilityIdNum) || facilityIdNum <= 0) {
			nextErrors.facilityId = "Selecciona una instalación válida";
		}
		if (!form.fechaIso || !date || Number.isNaN(date.getTime())) {
			nextErrors.fechaIso = "Ingresa una fecha y hora válida";
		}
		if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
			nextErrors.usuarioId = "Selecciona un usuario válido";
		}
		if (!Number.isFinite(estadoIdNum) || estadoIdNum <= 0) {
			nextErrors.estadoId = "Ingresa un estado (estatusID) válido";
		}
		if (!form.endFechaIso || !endDate || Number.isNaN(endDate.getTime())) {
			nextErrors.endFechaIso = "Ingresa una fecha y hora de fin válida";
		}

		if (date && endDate && !Number.isNaN(date.getTime()) && !Number.isNaN(endDate.getTime())) {
			if (endDate.getTime() <= date.getTime()) {
				nextErrors.endFechaIso = "La fecha/hora de fin debe ser mayor que la de inicio";
			}
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		setSubmitError("");

		try {
			await onSave?.({
				...form,
				fechaIso: date.toISOString(),
				endFechaIso: endDate.toISOString(),
				id: initialData?.id,
				facilityId: facilityIdNum,
				usuarioId: userIdNum,
				estadoId: estadoIdNum,
			});
			onClose?.();
		} catch (error) {
			console.error("Error saving reservation", error);

			const processed = extractBackendError(
				error,
				"No se pudo guardar la reserva. Intenta de nuevo.",
			);

			setSubmitError(processed.message || "No se pudo guardar la reserva. Intenta de nuevo.");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				{initialData ? "Editar reserva" : "Nueva reserva"}
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
						{installations.map((inst) => (
							<MenuItem key={inst.id} value={inst.id}>
								{inst.nombre}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Usuario"
						name="usuarioId"
						fullWidth
						value={form.usuarioId}
						onChange={handleChange}
						required
						error={Boolean(errors.usuarioId)}
						helperText={errors.usuarioId}
					>
						<MenuItem value="">Selecciona un usuario</MenuItem>
						{users.map((u) => (
							<MenuItem key={u.id} value={u.id}>
								{u.nombre} ({u.email})
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="Estado"
						name="estadoId"
						fullWidth
						value={form.estadoId}
						onChange={handleChange}
						required
						error={Boolean(errors.estadoId)}
						helperText={errors.estadoId}
					>
						{statuses.map((status) => (
							<MenuItem key={status.id} value={status.id} disabled={Boolean(initialData) && ["2"].includes(String(status.id))}>
								{status.label}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label="Fecha y hora"
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

					<TextField
						label="Fecha y hora fin"
						name="endFechaIso"
						type="datetime-local"
						fullWidth
						value={form.endFechaIso}
						onChange={handleChange}
						required
						InputLabelProps={{ shrink: true }}
						error={Boolean(errors.endFechaIso)}
						helperText={errors.endFechaIso}
					/>

					{submitError ? (
						<Alert severity="error" sx={{ mt: 2 }}>
							{submitError}
						</Alert>
					) : null}
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
				<Button onClick={onClose} color="inherit">
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 140 }}>
					{initialData ? "Guardar cambios" : "Agregar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
