import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import Alert from "@mui/material/Alert";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import { getUsers } from "../services/users";

export default function UsersPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(7);
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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
			`${u.nombre} ${u.email || ""} ${u.rol || ""} ${u.estado || ""}`
				.toLowerCase()
				.includes(search.toLowerCase())
		);
	}, [search, users]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

	const columns = [
		{
			field: "nombre",
			headerName: "Nombre",
			flex: .5,
			minWidth: 250,
			renderCell: (p) => (
				<Box display="flex" alignItems="center" gap={1.5}>
					<img
						src={p.row.avatar}
						alt={p.row.nombre}
						width={36}
						height={36}
						style={{ borderRadius: "50%", objectFit: "cover" }}
					/>
					<Box>
						<Box sx={{ fontWeight: 600 }}>{p.row.nombre}</Box>
						<Box sx={{ fontSize: 13, color: "text.secondary" }}>{p.row.rol}</Box>
					</Box>
				</Box>
			),
		},
		{ field: "email", headerName: "Correo electrónico", flex: 1 },
		{ field: "estado", headerName: "Estado", width: 140 },
	];

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader title="Usuarios" />

			<Box display="flex" justifyContent="flex-end" mb={2}>
				<TextField
					placeholder="Buscar"
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
		</Box>
	);
}
