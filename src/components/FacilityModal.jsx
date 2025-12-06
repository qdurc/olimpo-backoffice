import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from "@mui/material";

export default function FacilityModal({
	open,
	onClose,
	onSave,
	initialData = null,
}) {
	const initialForm = {
		nombre: "",
		tipo: "",
		capacidad: "",
		direccion: "",
		estadoId: "1", // por defecto activo
	};

	const isEditing = Boolean(initialData);
	const [form, setForm] = useState(initialForm);

	React.useEffect(() => {
		if (open && initialData) {
			setForm({
				nombre: initialData.nombre ?? "",
				tipo: initialData.tipo ?? "",
				capacidad: initialData.capacidad ?? "",
				direccion: initialData.direccion ?? "",
				estadoId:
					initialData.statusId === null || initialData.statusId === undefined
						? ""
						: String(initialData.statusId),
			});
		} else if (!open) {
			setForm(initialForm);
		}
	}, [open, initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		if (!form.nombre.trim()) return;

		const estadoId = form.estadoId === "" ? null : Number(form.estadoId);

		onSave?.({
			...form,
			id: initialData?.id,
			capacidad: Number(form.capacidad) || 0,
			estadoId, // se envía como número a la API
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
					label="Estado (ID numérico)"
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
				<Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 120 }}>
					{isEditing ? "Guardar cambios" : "Agregar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
