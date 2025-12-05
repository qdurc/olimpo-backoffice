import React, { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	MenuItem,
	Box,
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
	const [errors, setErrors] = useState({});

	const getDefaultRange = () => {
		const start = new Date();
		start.setSeconds(0, 0);
		const end = new Date(start.getTime() + 60 * 60 * 1000);
		return {
			inicio: formatDateTimeLocal(start),
			fin: formatDateTimeLocal(end),
		};
	};

	const parseDate = (value) => {
		if (!value) return null;
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	};

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
			setErrors({});
		} else if (open && !initialData) {
			const defaults = getDefaultRange();
			setForm((prev) => ({
				...prev,
				...emptyForm,
				...defaults,
			}));
			setErrors({});
		} else if (!open) {
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
		const startDate = parseDate(form.inicio);
		const endDate = parseDate(form.fin);

		if (!form.facilityId) {
			nextErrors.facilityId = "Selecciona la instalación";
		}
		if (!startDate) {
			nextErrors.inicio = "Ingresa una fecha y hora de inicio válida";
		}
		if (!endDate) {
			nextErrors.fin = "Ingresa una fecha y hora de fin válida";
		} else if (startDate && endDate < startDate) {
			nextErrors.fin = "La fecha fin debe ser posterior al inicio";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		onSave?.({
			...form,
			id: initialData?.id,
			usuarioId: form.usuarioId === "" ? null : form.usuarioId,
			estadoId: form.estadoId === "" ? null : form.estadoId,
			inicio: startDate.toISOString(),
			fin: endDate.toISOString(),
		});

		setForm(emptyForm);
		onClose?.();
	};

return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				{initialData ? "Editar mantenimiento" : "Nuevo mantenimiento"}
			</DialogTitle>

			<DialogContent
				sx={{
					pt: 1,
					px: 4,
					pb: 2,
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}
			>
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
					label="Descripción"
					name="descripcion"
					fullWidth
					multiline
					minRows={2}
					value={form.descripcion}
					onChange={handleChange}
				/>

				<TextField
					label="Inicio"
					name="inicio"
					type="datetime-local"
					fullWidth
					value={form.inicio}
					onChange={handleChange}
					required
					InputLabelProps={{ shrink: true }}
					error={Boolean(errors.inicio)}
					helperText={errors.inicio}
				/>

				<TextField
					label="Fin"
					name="fin"
					type="datetime-local"
					fullWidth
					value={form.fin}
					onChange={handleChange}
					required
					InputLabelProps={{ shrink: true }}
					error={Boolean(errors.fin)}
					helperText={errors.fin}
				/>

				<TextField
					label="Usuario ID"
					name="usuarioId"
					type="number"
					fullWidth
					value={form.usuarioId}
					onChange={handleChange}
				/>

				<TextField
					label="Estado (estatusID)"
					name="estadoId"
					type="number"
					fullWidth
					value={form.estadoId}
					onChange={handleChange}
				/>
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
