import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from "@mui/material";

export default function UserModal({
	open,
	onClose,
	onSave,
	initialData = null,
	roles = [],
	loading = false,
}) {
	const emptyForm = useMemo(
		() => ({
			nombre: "",
			email: "",
			rolId: "",
			estadoId: "",
			password: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (open) {
			const defaultRol = !initialData && roles.length
				? String(roles[0].id)
				: "";

			setForm({
				nombre: initialData?.nombre ?? "",
				email: initialData?.email ?? "",
				rolId:
					initialData?.rolId !== undefined && initialData?.rolId !== null
						? String(initialData.rolId)
						: defaultRol,
				estadoId: "1",
				password: "",
			});
			setErrors({});
		} else {
			setForm(emptyForm);
			setErrors({});
		}
	}, [open, initialData, emptyForm, roles]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		const nextErrors = {};

		if (!form.nombre.trim()) {
			nextErrors.nombre = "Nombre requerido";
		}
		if (!form.email.trim()) {
			nextErrors.email = "Correo requerido";
		}
		if (!initialData) {
			if (!form.password.trim()) {
				nextErrors.password = "Contraseña requerida";
			} else if (form.password.trim().length < 6) {
				nextErrors.password = "Mínimo 6 caracteres";
			}
		}
		if (roles.length && !form.rolId) {
			nextErrors.rolId = "Selecciona un rol";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		onSave?.({
			id: initialData?.id,
			nombre: form.nombre.trim(),
			email: form.email.trim(),
			rolId: form.rolId === "" ? null : form.rolId,
			estadoId: form.estadoId === "" ? null : form.estadoId,
			password: form.password.trim(),
		});
		onClose?.();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: 700, fontSize: "1.15rem" }}>
				{initialData ? "Editar Usuario" : "Nuevo Usuario"}
			</DialogTitle>
			<DialogContent sx={{ pt: 1.5 }}>
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
						label="Correo"
						name="email"
						type="email"
						fullWidth
						required
						value={form.email}
						onChange={handleChange}
						error={Boolean(errors.email)}
						helperText={errors.email}
					/>
					{!initialData && (
						<TextField
							label="Contraseña"
							name="password"
							type="password"
							fullWidth
							required
							value={form.password}
							onChange={handleChange}
							error={Boolean(errors.password)}
							helperText={errors.password}
							inputProps={{ minLength: 6 }}
						/>
					)}
					<TextField
						select
						label="Rol"
						name="rolId"
						fullWidth
						required={Boolean(roles.length)}
						value={form.rolId}
						onChange={handleChange}
						error={Boolean(errors.rolId)}
						helperText={errors.rolId}
					>
						<MenuItem value="">Selecciona</MenuItem>
						{roles.map((role) => (
							<MenuItem key={role.id} value={String(role.id)}>
								{role.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="Estado"
						name="estadoId"
						fullWidth
						value={
							form.estadoId === "1"
								? "Activo"
								: form.estadoId === "2"
									? "Inactivo"
									: form.estadoId
						}
						disabled
						helperText="Estado asignado automáticamente"
					/>
				</Box>
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
