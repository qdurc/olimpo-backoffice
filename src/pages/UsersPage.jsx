import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import UserModal from "../components/UserModal";
import UserHistoryModal from "../components/UserHistoryModal";
import { getUserHistoryTournamentByUser } from "../services/tournaments";
import { getUserEdit, getUsers, updateUser, createUser } from "../services/users";

export default function UsersPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const [editing, setEditing] = useState(null);
	const [editOptions, setEditOptions] = useState({ roles: [], statuses: [] });
	const [submitting, setSubmitting] = useState(false);
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [openHistory, setOpenHistory] = useState(false);
	const [historyUser, setHistoryUser] = useState(null);
	const [historyItems, setHistoryItems] = useState([]);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [historyError, setHistoryError] = useState("");
	const statusOptions = useMemo(
		() => [
			{ id: 1, label: "Activo" },
			{ id: 2, label: "Inactivo" },
		],
		[],
	);
	const roleOptions = useMemo(
		() => [
			{ id: 1, label: "Admin" },
			{ id: 2, label: "Usuario" },
		],
		[],
	);
	const personTypeOptions = useMemo(
		() => [
			{ id: 1, label: "Atleta" },
			{ id: 2, label: "Entrenador" },
		],
		[],
	);

	useEffect(() => {
		setLoading(true);
		setError("");
		getUsers()
			.then((res) => setUsers(res))
			.catch((err) => {
				console.error("Error fetching users", err);
				const message =
					err instanceof Error
						? err.message
						: "No se pudieron cargar los usuarios. Intenta más tarde.";
				setError(message);
				setUsers([]);
			})
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(() => {
		return users.filter((u) =>
			`${u.nombre} ${u.email || ""} ${u.rol || ""} ${u.estado || ""} ${u.identification || ""} ${u.gender || ""} ${u.bornDateIso || ""}`
				.toLowerCase()
				.includes(search.toLowerCase())
		);
	}, [search, users]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

	const resolveOptionId = (label, options) => {
		if (!label) return "";
		const normalized = label.toLowerCase().trim();
		const found = options.find(
			(option) =>
				typeof option.label === "string" &&
				option.label.toLowerCase().trim() === normalized,
		);
		return found ? String(found.id) : "";
	};

	const handleEdit = async (id) => {
		const found = users.find((u) => String(u.id) === String(id));
		if (!found) return;
		setLoadingEdit(true);
		try {
			const editData = await getUserEdit(id, found);
			const roleId = resolveOptionId(found.rol, editData.roles);
			const statusId = resolveOptionId(found.estado, editData.statuses);

			setEditing({
				...found,
				...editData.user,
				rolId: roleId || found.rolId || "",
				estadoId: statusId || found.estadoId || "",
			});
			setEditOptions({ roles: editData.roles, statuses: editData.statuses });
			setOpenModal(true);
		} catch (err) {
			console.error("Error cargando datos de edición del usuario", err);
		} finally {
			setLoadingEdit(false);
		}
	};

	const handleHistory = async (id) => {
		const found = users.find((u) => String(u.id) === String(id));
		setHistoryUser(found ?? { id, nombre: "" });
		setOpenHistory(true);
		setHistoryLoading(true);
		setHistoryError("");
		setHistoryItems([]);

		try {
			const items = await getUserHistoryTournamentByUser(id);
			setHistoryItems(items);
		} catch (err) {
			console.error("Error cargando historial", err);
			const msg =
				err instanceof Error ? err.message : "No se pudo cargar el historial.";
			setHistoryError(msg);
		} finally {
			setHistoryLoading(false);
		}
	};

	const handleSave = async (payload) => {
		try {
			setSubmitting(true);
			setError("");
			if (payload.id) {
				const existing = users.find((u) => String(u.id) === String(payload.id));
				const updated = await updateUser(payload.id, payload, existing);

				const roleLabel = existing?.rol ?? updated.rol;

				const statusLabel =
					editOptions.statuses.find((s) => String(s.id) === String(payload.estadoId))?.label ??
					statusOptions.find((s) => String(s.id) === String(payload.estadoId))?.label ??
					updated.estado;

				const merged = {
					...existing,
					...updated,
					rol: roleLabel ?? updated.rol,
					estado: statusLabel ?? updated.estado,

					rolId: existing?.rolId ?? updated.rolId ?? null,

					estadoId: payload.estadoId ?? updated.estadoId ?? existing?.estadoId ?? null,

					personType: updated.personType ?? existing?.personType ?? "",
					personTypeId: payload.personTypeId ?? updated.personTypeId ?? existing?.personTypeId ?? null,

					identification: updated.identification ?? existing?.identification ?? null,
				};

				setUsers((prev) =>
					prev.map((u) => (String(u.id) === String(payload.id) ? { ...u, ...merged } : u)),
				);
			} else {
				const createPayload = {
					...payload,
					rolId: payload.rolId ?? 2,
					estadoId: payload.estadoId ?? 1,
				};

				const created = await createUser(createPayload);

				const rolesSource = editOptions.roles.length ? editOptions.roles : roleOptions;
				const statusesSource = editOptions.statuses.length ? editOptions.statuses : statusOptions;

				const roleLabel =
					rolesSource.find((r) => String(r.id) === String(createPayload.rolId))?.label ?? created.rol;

				const statusLabel =
					statusesSource.find((s) => String(s.id) === String(createPayload.estadoId))?.label ??
					created.estado;

				const personTypeLabel =
					personTypeOptions.find(
						(p) => String(p.id) === String(createPayload.personTypeId ?? created.personTypeId),
					)?.label ?? created.personType ?? "";

				const merged = {
					...created,
					rol: roleLabel,
					estado: statusLabel,
					personType: personTypeLabel,
					personTypeId: createPayload.personTypeId ?? created.personTypeId ?? null,
					rolId: createPayload.rolId ?? created.rolId ?? null,
					estadoId: createPayload.estadoId ?? created.estadoId ?? null,
					identification: createPayload.identification ?? created.identification ?? null,
					bornDateIso: createPayload.bornDateIso ?? created.bornDateIso ?? null,
					gender: createPayload.gender ?? created.gender ?? null,
				};

				setUsers((prev) => [...prev, merged]);
			}
		} catch (err) {
			console.error("Error guardando usuario", err);
			const msg =
				err instanceof Error
					? err.message
					: "No se pudo guardar el usuario (error desconocido).";
			setError(msg);
		} finally {
			setSubmitting(false);
			setEditing(null);
			setOpenModal(false);
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{
			field: "nombre",
			headerName: "Nombre",
			flex: .2,
			minWidth: 250,
			renderCell: (p) => (
				<Box display="flex" alignItems="center">
					<Box>
						<Box sx={{ fontWeight: 600 }}>{p.row.nombre}</Box>
						<Box sx={{ fontSize: 13, color: "text.secondary" }}>{p.row.rol}</Box>
					</Box>
				</Box>
			),
		},
		{ field: "email", headerName: "Correo electrónico", flex: 1 },
		{ field: "personType", headerName: "Tipo", width: 140 },
		{ field: "identification", headerName: "Cédula", width: 160 },
		{
			field: "bornDateIso",
			headerName: "Fecha de Nacimiento",
			width: 180,
			renderCell: (p) =>
				p.value ? new Date(p.value).toLocaleDateString() : "",
		},
		{ field: "gender", headerName: "Género", width: 110 },
		{
			field: "estado",
			headerName: "Estado",
			width: 140,
			renderCell: (p) => <StatusPill value={p.value} />,
		},
	];

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Usuarios"
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditing(null);
							setOpenModal(true);
						}}
					>
						Nuevo Usuario
					</Button>
				}
			/>

			<Box display="flex" justifyContent="flex-end" mb={2}>
				<TextField
					placeholder="Buscar"
					type="text"
					size="small"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchRounded fontSize="small" />
							</InputAdornment>
						),
						sx: { borderRadius: 2, width: 260 },
					}}
				/>
			</Box>

			{error ? (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			) : null}

			<EntityTable
				rows={rows}
				columns={columns}
				loading={loading}
				rowCount={filtered.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
				onEdit={handleEdit}
				onHistory={handleHistory}
			// onDelete={handleDelete}
			/>

			<TableFooter
				page={page}
				pageCount={pageCount}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(n) => {
					setPageSize(n);
					setPage(1);
				}}
			/>

			<UserModal
				open={openModal}
				onClose={() => {
					if (loadingEdit) return;
					setOpenModal(false);
					setEditing(null);
				}}
				onSave={handleSave}
				initialData={editing}
				roles={editOptions.roles.length ? editOptions.roles : roleOptions}
				statuses={editOptions.statuses.length ? editOptions.statuses : statusOptions}
				loading={submitting}
			/>

			<UserHistoryModal
				open={openHistory}
				onClose={() => setOpenHistory(false)}
				user={historyUser}
				loading={historyLoading}
				error={historyError}
				items={historyItems}
			/>
		</Box>
	);
}
