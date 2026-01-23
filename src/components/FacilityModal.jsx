import React, { useMemo, useState } from "react";
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
	const [errors, setErrors] = useState({});

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
			setErrors({});
		} else if (open && !initialData) {
			const defaultStatus =
				installationStatuses.find((s) => s.id === 1)?.id?.toString?.() ||
				installationStatuses[0]?.id?.toString?.() ||
				"";
			setForm({ ...initialForm, estadoId: defaultStatus });
			setErrors({});
		} else if (!open) {
			setForm(initialForm);
			setErrors({});
		}
	}, [open, initialData, initialForm]);


	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};


	const handleSubmit = async () => {
		const nextErrors = {};

		const estadoIdNum = form.estadoId === "" ? NaN : Number(form.estadoId);
		const capacidadNum = form.capacidad === "" ? NaN : Number(form.capacidad);

		if (!form.nombre?.trim()) nextErrors.nombre = "Ingresa el nombre";
		if (!form.tipo?.trim()) nextErrors.tipo = "Ingresa el tipo";
		if (!form.direccion?.trim()) nextErrors.direccion = "Ingresa la dirección";

		if (!Number.isFinite(capacidadNum) || capacidadNum <= 0) {
			nextErrors.capacidad = "Ingresa una capacidad válida (mayor que 0)";
		}

		if (!Number.isFinite(estadoIdNum) || estadoIdNum <= 0) {
			nextErrors.estadoId = "Selecciona un estado válido";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		const estadoTexto =
			installationStatuses.find((s) => s.id === estadoIdNum)?.label ?? String(estadoIdNum);

		await onSave?.({
			...form,
			id: initialData?.id,
			capacidad: capacidadNum,
			estadoId: estadoIdNum,
			estado: estadoTexto,
		});

		setForm(initialForm);
		onClose?.();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
				{isEditing ? "Editar Instalación" : "Nueva Instalación"}
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
						required
						value={form.nombre}
						onChange={handleChange}
						error={Boolean(errors.nombre)}
						helperText={errors.nombre}
					/>

					<TextField
						label="Tipo"
						name="tipo"
						fullWidth
						required
						value={form.tipo}
						onChange={handleChange}
						error={Boolean(errors.tipo)}
						helperText={errors.tipo}
					/>

					<TextField
						label="Capacidad"
						name="capacidad"
						type="number"
						fullWidth
						required
						inputProps={{ min: 1 }}
						value={form.capacidad}
						onChange={handleChange}
						error={Boolean(errors.capacidad)}
						helperText={errors.capacidad}
					/>

					<TextField
						label="Dirección"
						name="direccion"
						fullWidth
						required
						value={form.direccion}
						onChange={handleChange}
						error={Boolean(errors.direccion)}
						helperText={errors.direccion}
					/>

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
						<MenuItem value="">Selecciona</MenuItem>
						{installationStatuses.map((status) => (
							<MenuItem
								key={status.id}
								value={status.id}
								disabled={isEditing && String(status.id) === "2"}
							>
								{status.label}
							</MenuItem>
						))}
					</TextField>
				</Box>
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
