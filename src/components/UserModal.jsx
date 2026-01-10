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
	statuses = [],
	loading = false,
}) {
	const emptyForm = useMemo(
		() => ({
			nombre: "",
			email: "",
			rolId: "",
			estadoId: "",
			personTypeId: "",
			password: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (open) {
			setForm({
				nombre: initialData?.nombre ?? "",
				email: initialData?.email ?? "",
				rolId:
					initialData?.rolId !== undefined && initialData?.rolId !== null
						? String(initialData.rolId)
						: "",
				estadoId:
					initialData?.estadoId !== undefined && initialData?.estadoId !== null
						? String(initialData.estadoId)
						: "",
				personTypeId:
					initialData?.personTypeId !== undefined && initialData?.personTypeId !== null
						? String(initialData.personTypeId)
						: "",
				password: "",
			});
			setErrors({});
		} else {
			setForm(emptyForm);
			setErrors({});
		}
	}, [open, initialData, emptyForm, roles, statuses]);

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
		if (statuses.length && !form.estadoId) {
			nextErrors.estadoId = "Selecciona un estado";
		}

		const personTypeNum = Number(form.personTypeId);
		if (![1, 2].includes(personTypeNum)) {
			nextErrors.personTypeId = "Selecciona Atleta o Entrenador";
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		onSave?.({
			id: initialData?.id,
			nombre: form.nombre.trim(),
			email: form.email.trim(),
			rolId: form.rolId === "" ? null : form.rolId,
			estadoId: form.estadoId === "" ? null : form.estadoId,
			personTypeId: Number(form.personTypeId),
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
						select
						label="Tipo de persona"
						name="personTypeId"
						fullWidth
						required
						value={form.personTypeId}
						onChange={handleChange}
						error={Boolean(errors.personTypeId)}
						helperText={errors.personTypeId}
					>
						<MenuItem value="">Selecciona</MenuItem>
						<MenuItem value="1">Atleta</MenuItem>
						<MenuItem value="2">Entrenador</MenuItem>
					</TextField>
					<TextField
						select
						label="Estado"
						name="estadoId"
						fullWidth
						required={Boolean(statuses.length)}
						value={form.estadoId}
						onChange={handleChange}
						error={Boolean(errors.estadoId)}
						helperText={errors.estadoId}
					>
						<MenuItem value="">Selecciona</MenuItem>
						{statuses.map((s) => (
							<MenuItem key={s.id} value={String(s.id)}>
								{s.label}
							</MenuItem>
						))}
					</TextField>
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
