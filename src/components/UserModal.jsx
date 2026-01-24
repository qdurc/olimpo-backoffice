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
			bornDateIso: "",
			gender: "",
			identification: "",
		}),
		[],
	);

	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});

	const toDateInputValue = (value) => {
		if (!value) return "";
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "";

		const pad = (n) => n.toString().padStart(2, "0");
		const year = d.getFullYear();
		const month = pad(d.getMonth() + 1);
		const day = pad(d.getDate());
		return `${year}-${month}-${day}`;
	};

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
				bornDateIso: toDateInputValue(
					initialData?.bornDateIso ?? initialData?.bornDate ?? null,
				),
				gender: initialData?.gender ?? "",
				identification:
					(initialData?.identification ??
						initialData?.cedula ??
						"")
						.replace(/\D/g, "")
						.slice(0, 11),
			});
			setErrors({});
		} else {
			setForm(emptyForm);
			setErrors({});
		}
	}, [open, initialData, emptyForm, roles, statuses]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === "identification") {
			const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
			setForm((prev) => ({ ...prev, identification: digitsOnly }));
			return;
		}

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		const nextErrors = {};

		if (!form.nombre.trim()) nextErrors.nombre = "Nombre requerido";

		if (!initialData && !form.email.trim()) nextErrors.email = "Correo requerido";

		if (!initialData) {
			if (!form.password.trim()) nextErrors.password = "Contraseña requerida";
			else if (form.password.trim().length < 6) nextErrors.password = "Mínimo 6 caracteres";
		}

		if (!initialData && roles.length && !form.rolId) nextErrors.rolId = "Selecciona un rol";

		if (statuses.length && !form.estadoId) nextErrors.estadoId = "Selecciona un estado";

		const personTypeNum = Number(form.personTypeId);
		if (![1, 2].includes(personTypeNum)) nextErrors.personTypeId = "Selecciona Atleta o Entrenador";

		if (!form.bornDateIso) {
			nextErrors.bornDateIso = "Fecha de nacimiento requerida";
		} else {
			const d = new Date(form.bornDateIso);
			if (Number.isNaN(d.getTime())) nextErrors.bornDateIso = "Fecha de nacimiento inválida";
		}

		const gender = form.gender?.trim();
		if (!gender) nextErrors.gender = "Género requerido";
		else if (!["M", "F"].includes(gender)) nextErrors.gender = "Selecciona M o F";

		if (!initialData && !form.identification.trim()) nextErrors.identification = "Identificación requerida";

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;

		const basePayload = {
			id: initialData?.id,
			nombre: form.nombre.trim(),
			personTypeId: Number(form.personTypeId),
			estadoId: form.estadoId === "" ? null : form.estadoId,
			bornDateIso: form.bornDateIso || null,
			gender: gender || null,
		};

		if (initialData) {
			onSave?.({
				...basePayload,
			});
		} else {
			onSave?.({
				...basePayload,
				email: form.email.trim(),
				rolId: form.rolId === "" ? null : form.rolId,
				password: form.password.trim(),
				identification: form.identification.trim() || null,
			});
		}

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
						required={!initialData}
						value={form.email}
						onChange={handleChange}
						error={Boolean(errors.email)}
						helperText={errors.email}
						disabled={Boolean(initialData)}
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
						required={!initialData && Boolean(roles.length)}
						value={form.rolId}
						onChange={handleChange}
						error={Boolean(errors.rolId)}
						helperText={errors.rolId}
						disabled={Boolean(initialData)}
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
						label="Fecha de nacimiento"
						name="bornDateIso"
						type="date"
						fullWidth
						required
						value={form.bornDateIso}
						onChange={handleChange}
						InputLabelProps={{ shrink: true }}
						error={Boolean(errors.bornDateIso)}
						helperText={errors.bornDateIso}
					/>
					<TextField
						select
						label="Género"
						name="gender"
						fullWidth
						required
						value={form.gender}
						onChange={handleChange}
						error={Boolean(errors.gender)}
						helperText={errors.gender}
					>
						<MenuItem value="">Selecciona</MenuItem>
						<MenuItem value="M">Masculino</MenuItem>
						<MenuItem value="F">Femenino</MenuItem>
					</TextField>
					<TextField
						label="Cédula"
						name="identification"
						fullWidth
						required={!initialData}
						value={form.identification}
						onChange={handleChange}
						error={Boolean(errors.identification)}
						helperText={errors.identification}
						disabled={Boolean(initialData)}
					/>
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
