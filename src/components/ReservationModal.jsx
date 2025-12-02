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
	Alert,
} from "@mui/material";

function formatDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().slice(0, 16);
}

export default function ReservationModal({
	open,
	onClose,
	onSave,
	installations = [],
	initialData = null,
}) {
	const emptyForm = useMemo(
		() => ({
			facilityId: "",
			usuarioId: "",
			fechaIso: "",
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
				estadoId:
					initialData.estadoId === null || initialData.estadoId === undefined
						? ""
						: String(initialData.estadoId),
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
	}, [open, initialData, emptyForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const nextErrors = {};
		const date = form.fechaIso ? new Date(form.fechaIso) : null;
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
			nextErrors.usuarioId = "Ingresa un usuario válido";
		}
		if (!Number.isFinite(estadoIdNum) || estadoIdNum <= 0) {
			nextErrors.estadoId = "Ingresa un estado (estatusID) válido";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		setSubmitError("");

		try {
			await onSave?.({
				...form,
				fechaIso: date.toISOString(),
				id: initialData?.id,
				facilityId: facilityIdNum,
				usuarioId: userIdNum,
				estadoId: estadoIdNum,
			});
			onClose?.();
		} catch (error) {
			console.error("Error saving reservation", error);
			const message =
				error instanceof Error
					? error.message
					: "No se pudo guardar la reserva. Intenta de nuevo.";
			setSubmitError(message);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
				{initialData ? "Editar reserva" : "Nueva reserva"}
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

					<Grid item xs={12}>
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
					</Grid>
				</Grid>

				{submitError ? (
					<Alert severity="error" sx={{ mt: 2 }}>
						{submitError}
					</Alert>
				) : null}
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
