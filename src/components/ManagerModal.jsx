import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";

export default function ManagerModal({ open, onClose, onSave, initialData = null }) {
	const emptyForm = useMemo(
		() => ({
			nombreCompleto: "",
			fechaNacimiento: "",
			cedula: "",
		}),
		[],
	);

	const toDateInput = (value) => {
		if (!value) return "";
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? value : d.toISOString().slice(0, 10);
	};

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (open && initialData) {
			setForm({
				nombreCompleto: initialData.nombreCompleto ?? "",
				fechaNacimiento: toDateInput(initialData.fechaNacimiento),
				cedula: initialData.cedula ?? "",
			});
			setErrors({});
		} else if (open) {
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
		const date = form.fechaNacimiento ? new Date(form.fechaNacimiento) : null;
		if (!form.nombreCompleto.trim()) {
			nextErrors.nombreCompleto = "Nombre requerido";
		}
		if (!form.fechaNacimiento) {
			nextErrors.fechaNacimiento = "Fecha de nacimiento requerida";
		} else if (date && Number.isNaN(date.getTime())) {
			nextErrors.fechaNacimiento = "Fecha inválida";
		}
		if (!form.cedula.trim()) {
			nextErrors.cedula = "Cédula requerida";
		}
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		const fechaIso =
			date && !Number.isNaN(date.getTime())
				? date.toISOString()
				: form.fechaNacimiento;

		onSave?.({
			id: initialData?.id,
			nombreCompleto: form.nombreCompleto.trim(),
			fechaNacimiento: fechaIso,
			cedula: form.cedula.trim(),
		});
		onClose?.();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
				{initialData ? "Editar Encargado" : "Nuevo Encargado"}
			</DialogTitle>
			<DialogContent sx={{ pt: 1.5 }}>
				<Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
					<TextField
						label="Nombre completo"
						name="nombreCompleto"
						fullWidth
						required
						value={form.nombreCompleto}
						onChange={handleChange}
						error={Boolean(errors.nombreCompleto)}
						helperText={errors.nombreCompleto}
					/>
					<TextField
						label="Fecha de nacimiento"
						name="fechaNacimiento"
						fullWidth
						required
						type="date"
						value={form.fechaNacimiento}
						onChange={handleChange}
						error={Boolean(errors.fechaNacimiento)}
						helperText={errors.fechaNacimiento}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						label="Cédula"
						name="cedula"
						fullWidth
						required
						value={form.cedula}
						onChange={handleChange}
						error={Boolean(errors.cedula)}
						helperText={errors.cedula}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant="contained" onClick={handleSubmit}>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
