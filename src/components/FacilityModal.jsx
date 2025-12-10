import React, { useMemo, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	MenuItem,
} from "@mui/material";
import { installationStatuses } from "../services/installations";

export default function FacilityModal({
	open,
	onClose,
	onSave,
	initialData = null,
}) {
	const initialForm = useMemo(
		() => ({
			nombre: "",
			tipo: "",
			capacidad: "",
			direccion: "",
			estadoId: "",
		}),
		[],
	);

	const isEditing = Boolean(initialData);
	const [form, setForm] = useState(initialForm);

	const normalizeStatusId = (value) => {
		if (value === null || value === undefined) return "";
		const asString = String(value);
		const byId = installationStatuses.find((s) => String(s.id) === asString);
		if (byId) return asString;
		const normalizedLabel = asString.toLowerCase().trim();
		const byLabel = installationStatuses.find(
			(s) => typeof s.label === "string" && s.label.toLowerCase().trim() === normalizedLabel,
		);
		return byLabel ? String(byLabel.id) : "";
	};

	React.useEffect(() => {
		if (open && initialData) {
			setForm({
				nombre: initialData.nombre ?? "",
				tipo: initialData.tipo ?? "",
				capacidad: initialData.capacidad ?? "",
				direccion: initialData.direccion ?? "",
				estadoId:
					initialData.statusId === null || initialData.statusId === undefined
						? normalizeStatusId(initialData.estado)
						: normalizeStatusId(initialData.statusId),
			});
		} else if (open && !initialData) {
			const defaultStatus =
				installationStatuses.find((s) => s.id === 1)?.id?.toString?.() ||
				installationStatuses[0]?.id?.toString?.() ||
				"";
			setForm({ ...initialForm, estadoId: defaultStatus });
		} else if (!open) {
			setForm(initialForm);
		}
	}, [open, initialData, initialForm]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		if (!form.nombre.trim()) return;

		const estadoId = form.estadoId === "" ? null : Number(form.estadoId);
		const estadoTexto =
			estadoId !== null
				? installationStatuses.find((s) => s.id === estadoId)?.label ?? String(estadoId)
				: "";

		onSave?.({
			...form,
			id: initialData?.id,
			capacidad: Number(form.capacidad) || 0,
			estadoId,
			estado: estadoTexto,
		});

		setForm(initialForm);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				{isEditing ? "Editar Instalación" : "Nueva Instalación"}
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
					label="Nombre"
					name="nombre"
					fullWidth
					value={form.nombre}
					onChange={handleChange}
				/>

				<TextField
					label="Tipo"
					name="tipo"
					fullWidth
					value={form.tipo}
					onChange={handleChange}
				/>

				<TextField
					label="Capacidad"
					name="capacidad"
					type="number"
					fullWidth
					value={form.capacidad}
					onChange={handleChange}
				/>

				<TextField
					label="Dirección"
					name="direccion"
					fullWidth
					value={form.direccion}
					onChange={handleChange}
				/>

				<TextField
					select
					label="Estado"
					name="estadoId"
					fullWidth
					value={form.estadoId}
					onChange={handleChange}
					required
				>
					<MenuItem value="">Selecciona</MenuItem>
					{installationStatuses.map((status) => (
						<MenuItem key={status.id} value={status.id}>
							{status.label}
						</MenuItem>
					))}
				</TextField>
			</DialogContent>

			<DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
				<Button onClick={onClose} color="inherit">
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 120 }}>
					{isEditing ? "Guardar cambios" : "Agregar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
