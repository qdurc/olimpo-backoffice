import React, { useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";

import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import TorneoModal from "../components/TorneoModal";

const INITIAL_TORNEOS = [
	{
		id: 1,
		nombre: "Olimpo Basket 2025",
		disciplina: "Baloncesto",
		categoria: "Juvenil",
		fecha: "25/07/2025",
		instalacion: "Cancha Olímpica #1",
		estado: "En Curso",
	},
	{
		id: 2,
		nombre: "Copa Natación Invierno",
		disciplina: "Natación",
		categoria: "Libre",
		fecha: "30/07/2025",
		instalacion: "Piscina Semiolímpica",
		estado: "En Curso",
	},
	{
		id: 3,
		nombre: "Torneo Artes Marciales Cinta Negra",
		disciplina: "Karate",
		categoria: "Avanzado",
		fecha: "05/08/2025",
		instalacion: "Salón de Artes Marciales",
		estado: "Abierto",
	},
	{
		id: 4,
		nombre: "Liga Olimpo de Fútbol Escolar",
		disciplina: "Fútbol",
		categoria: "Sub-17",
		fecha: "12/07/2025",
		instalacion: "Salón de Artes Marciales",
		estado: "Abierto",
	},
	{
		id: 5,
		nombre: "Olimpo Fit Challenge",
		disciplina: "General",
		categoria: "Mixto",
		fecha: "22/07/2025",
		instalacion: "Gimnasio multiuso",
		estado: "Finalizado",
	},
	{
		id: 6,
		nombre: "Olimpo Ping Pong Masters",
		disciplina: "Tenis de mesa",
		categoria: "Libre",
		fecha: "29/07/2025",
		instalacion: "Gimnasio multiuso",
		estado: "Finalizado",
	},
	{
		id: 7,
		nombre: "Juniors de los Mina",
		disciplina: "Baloncesto",
		categoria: "Juvenil",
		fecha: "02/08/2025",
		instalacion: "Cancha de Baloncesto #2",
		estado: "Finalizado",
	},
];

export default function TorneosPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [data, setData] = useState(INITIAL_TORNEOS);
	const [openModal, setOpenModal] = useState(false);

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return data.filter(
			(t) =>
				t.nombre.toLowerCase().includes(term) ||
				t.disciplina.toLowerCase().includes(term) ||
				t.categoria.toLowerCase().includes(term) ||
				t.instalacion.toLowerCase().includes(term)
		);
	}, [search, data]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, page * pageSize);

	const columns = [
		{ field: "nombre", headerName: "Nombre", flex: 1, minWidth: 240 },
		{ field: "disciplina", headerName: "Disciplina", flex: 1 },
		{ field: "categoria", headerName: "Categoria", flex: 1 },
		{ field: "fecha", headerName: "Fecha", width: 140 },
		{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 220 },
		{
			field: "estado",
			headerName: "Estado",
			width: 150,
			renderCell: (p) => <StatusPill value={p.value} />,
		},
	];

	const handleAddTorneo = (nuevo) => {
		setData((prev) => [
			...prev,
			{ id: prev.length ? prev[prev.length - 1].id + 1 : 1, ...nuevo },
		]);
	};

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Torneos"
				cta={
					<Button variant="contained" onClick={() => setOpenModal(true)}>
						Nuevo Torneo
					</Button>
				}
			/>

			<Box display="flex" justifyContent="flex-end" mb={1.5}>
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
				rows={paged}
				columns={columns}
				loading={false}
				rowCount={rows.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(n) => {
					setPageSize(n);
					setPage(1);
				}}
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

			<TorneoModal
				open={openModal}
				onClose={() => setOpenModal(false)}
				onSave={handleAddTorneo}
			/>
		</Box>
	);
}
