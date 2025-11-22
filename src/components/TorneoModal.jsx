import React, { useEffect, useState } from "react";
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

const ESTADOS = ["En Curso", "Abierto", "Finalizado"];

const initialForm = {
	nombre: "",
	disciplina: "",
	categoria: "",
	fecha: "",
	instalacion: "",
	estado: "En Curso",
};

export default function TorneoModal({ open, onClose, onSave }) {
	const [form, setForm] = useState(initialForm);

	// Cada vez que se abre el modal, reseteamos el formulario
	useEffect(() => {
		if (open) {
			setForm(initialForm);
		}
	}, [open]);

	const handleChange = (field) => (event) => {
		setForm((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const handleSubmit = () => {
		// Validaciones básicas (solo que no estén vacíos los campos clave)
		if (!form.nombre || !form.disciplina || !form.categoria) return;
		if (!form.fecha || !form.instalacion) return;

		onSave(form);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Nuevo Torneo</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2} sx={{ mt: 0.5 }}>
					<Grid item xs={12}>
						<TextField
							label="Nombre"
							fullWidth
							value={form.nombre}
							onChange={handleChange("nombre")}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Disciplina"
							fullWidth
							value={form.disciplina}
							onChange={handleChange("disciplina")}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Categoria"
							fullWidth
							value={form.categoria}
							onChange={handleChange("categoria")}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						{/* Puedes cambiar a type="date" si después quieres formatear la fecha */}
						<TextField
							label="Fecha"
							placeholder="25/07/2025"
							fullWidth
							value={form.fecha}
							onChange={handleChange("fecha")}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Instalación"
							fullWidth
							value={form.instalacion}
							onChange={handleChange("instalacion")}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							label="Estado"
							select
							fullWidth
							value={form.estado}
							onChange={handleChange("estado")}
						>
							{ESTADOS.map((op) => (
								<MenuItem key={op} value={op}>
									{op}
								</MenuItem>
							))}
						</TextField>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="inherit">
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleSubmit}>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
