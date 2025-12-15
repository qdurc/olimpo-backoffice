import React, { useEffect, useMemo, useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";

export default function DisciplineModal({ open, onClose, onSave, initialData = null, loading = false }) {
	const emptyForm = useMemo(
		() => ({
			descripcion: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (open && initialData) {
			setForm({
				descripcion: initialData.descripcion ?? "",
			});
			setErrors({});
		} else if (open) {
			setForm(emptyForm);
			setErrors({});
		}
	}, [open, initialData, emptyForm]);

	const handleChange = (e) => {
		const { value } = e.target;
		setForm({ descripcion: value });
	};

	const handleSubmit = () => {
		const nextErrors = {};
		if (!form.descripcion.trim()) {
			nextErrors.descripcion = "Descripción requerida";
		}
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		onSave?.({
			id: initialData?.id,
			descripcion: form.descripcion.trim(),
		});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
				{initialData ? "Editar Disciplina" : "Nueva Disciplina"}
			</DialogTitle>
			<DialogContent sx={{ pt: 1.5, pb: 1 }}>
				<TextField
					label="Descripción"
					fullWidth
					required
					value={form.descripcion}
					onChange={handleChange}
					error={Boolean(errors.descripcion)}
					helperText={errors.descripcion}
				/>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2 }}>
				<Button onClick={onClose} disabled={loading}>
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit} disabled={loading}>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
