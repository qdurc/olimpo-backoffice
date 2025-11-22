import React, { useMemo, useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";

const DATA = [
	{
		id: 1,
		nombre: "María González",
		rol: "Atleta",
		documento: "001-2345678-9",
		telefono: "(809) 555-1234",
		email: "maria.gonzalez@email.com",
		contrasena: "********",
		disciplina: "Baloncesto",
		foto: "https://i.pravatar.cc/36?img=11",
	},
	{
		id: 2,
		nombre: "Juan Pérez",
		rol: "Entrenador",
		documento: "402-9876543-2",
		telefono: "(829) 222-5678",
		email: "juan.perez@email.com",
		contrasena: "********",
		disciplina: "Fútbol",
		foto: "https://i.pravatar.cc/36?img=12",
	},
	{
		id: 3,
		nombre: "Laura Jiménez",
		rol: "Atleta",
		documento: "003-1122334-5",
		telefono: "(849) 123-4567",
		email: "laura.jimenez@email.com",
		contrasena: "********",
		disciplina: "Natación",
		foto: "https://i.pravatar.cc/36?img=13",
	},
	{
		id: 4,
		nombre: "Carlos Rodríguez",
		rol: "Atleta",
		documento: "001-8765432-1",
		telefono: "(809) 444-8899",
		email: "carlos.rdz@email.com",
		contrasena: "********",
		disciplina: "Atletismo",
		foto: "https://i.pravatar.cc/36?img=14",
	},
];

export default function UsuariosPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(7);
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		return DATA.filter((u) =>
			`${u.nombre} ${u.documento} ${u.email} ${u.disciplina}`
				.toLowerCase()
				.includes(search.toLowerCase())
		);
	}, [search]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

	const columns = [
		{
			field: "nombre",
			headerName: "Nombre",
			flex: 1,
			minWidth: 250,
			renderCell: (p) => (
				<Box display="flex" alignItems="center" gap={1.5}>
					<img
						src={p.row.foto}
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
		{ field: "documento", headerName: "Documento Identidad", flex: 1 },
		{ field: "telefono", headerName: "Teléfono", width: 160 },
		{ field: "email", headerName: "Correo electrónico", flex: 1 },
		{ field: "contrasena", headerName: "Contraseña", width: 140 },
		{ field: "disciplina", headerName: "Disciplina", width: 150 },
	];

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader title="Usuario" />

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

			<EntityTable
				rows={rows}
				columns={columns}
				loading={false}
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
