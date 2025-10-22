import React, { useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import TabsUnderline from "../components/TabsUnderline";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";

const DATA_INST = [
	{ id: 1, nombre: "Cancha Olímpica #1", especialidad: "Baloncesto", tipo: "Cancha techada", capacidad: 120, horarios: "Lun–Vie 8:00 am – 8:00 pm", estado: "Mantenimiento" },
	{ id: 2, nombre: "Piscina Semiolímpica", especialidad: "Natación", tipo: "Piscina", capacidad: 40, horarios: "Mar–Dom 7:00 am – 5:00 pm", estado: "Mantenimiento" },
	{ id: 3, nombre: "Salón de Artes Marciales", especialidad: "Karate", tipo: "Salón cerrado", capacidad: 30, horarios: "Lun–Sáb 3:00 pm – 9:00 pm", estado: "Disponible" },
	{ id: 4, nombre: "Campo de fútbol externo", especialidad: "Fútbol", tipo: "Campo abierto", capacidad: 150, horarios: "Lun–Vie 2:00 pm – 10:00 pm", estado: "Disponible" },
	{ id: 5, nombre: "Gimnasio multiuso", especialidad: "General", tipo: "Salón techado", capacidad: 100, horarios: "Todos los días 6:00 am – 9:00 pm", estado: "Bloqueada" },
	{ id: 6, nombre: "Pista de atletismo central", especialidad: "Atletismo", tipo: "Pista", capacidad: 80, horarios: "Lun–Vie 5:00 am – 7:00 pm", estado: "Bloqueada" },
	{ id: 7, nombre: "Pista de atletismo #2", especialidad: "Atletismo", tipo: "Pista", capacidad: 80, horarios: "Lun–Vie 5:00 am – 7:00 pm", estado: "Bloqueada" },
];

const DATA_REPORTES = [
	{ id: 11, nombre: "Cancha Olímpica #1", descripcion: "Daño en tablero de baloncesto", fecha: "15/07/2025", asignado: 120, tipo: "Correctivo", estado: "En Proceso" },
	{ id: 12, nombre: "Piscina Semiolímpica", descripcion: "Fuga de agua en sistema de filtrado", fecha: "14/07/2025", asignado: 40, tipo: "Correctivo", estado: "En Proceso" },
	{ id: 13, nombre: "Salón de Artes Marciales", descripcion: "Grieta en pared del lado sur", fecha: "10/07/2025", asignado: 30, tipo: "Preventivo", estado: "Resuelto" },
	{ id: 14, nombre: "Campo de fútbol externo", descripcion: "Cortar césped", fecha: "13/07/2025", asignado: 150, tipo: "Correctivo", estado: "Resuelto" },
	{ id: 15, nombre: "Gimnasio multiuso", descripcion: "Revisión rutinaria de ventilación", fecha: "08/07/2025", asignado: 100, tipo: "Correctivo", estado: "Pendiente" },
	{ id: 16, nombre: "Pista de atletismo central", descripcion: "Grietas en suelo", fecha: "16/07/2025", asignado: 80, tipo: "Correctivo", estado: "Pendiente" },
	{ id: 17, nombre: "Sala de Tenis", descripcion: "Luz principal intermitente", fecha: "16/08/2025", asignado: 80, tipo: "Preventivo", estado: "Pendiente" },
];

export default function InstalacionesPage() {
	const [tab, setTab] = useState(0);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(2);        // tu prototipo muestra la página 2
	const [pageSize, setPageSize] = useState(8);

	const rows = useMemo(() => {
		const base = tab === 0 ? DATA_INST : DATA_REPORTES;
		return base.filter(r =>
		(r.nombre?.toLowerCase().includes(search.toLowerCase()) ||
			r.descripcion?.toLowerCase?.().includes(search.toLowerCase()) ||
			r.especialidad?.toLowerCase?.().includes(search.toLowerCase()))
		);
	}, [tab, search]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

	const columnsInst = [
		{ field: "nombre", headerName: "Nombre", flex: 1, minWidth: 220 },
		{ field: "especialidad", headerName: "Especialidad", flex: 1 },
		{ field: "tipo", headerName: "Tipo", flex: 1 },
		{ field: "capacidad", headerName: "Capacidad", width: 120 },
		{ field: "horarios", headerName: "Horarios", flex: 1 },
		{ field: "estado", headerName: "Estado", width: 160, renderCell: (p) => <StatusPill value={p.value} /> },
	];

	const columnsRep = [
		{ field: "nombre", headerName: "Nombre", flex: 1, minWidth: 220 },
		{ field: "descripcion", headerName: "Descripcion", flex: 1 },
		{ field: "fecha", headerName: "Fecha", width: 140 },
		{ field: "asignado", headerName: "Asignado", width: 120 },
		{ field: "tipo", headerName: "Tipo", width: 140 },
		{ field: "estado", headerName: "Estado", width: 160, renderCell: (p) => <StatusPill value={p.value} /> },
	];

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Instalaciones"
				subtitle=""
				cta={
					<Button variant="contained">Nueva Instalación</Button>
				}
			/>

			{/* Tabs + Buscador a la derecha */}
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
				<TabsUnderline value={tab} onChange={(v) => { setTab(v); setPage(1); }} items={["Nueva Instalación", "Reportes de Mantenimiento"]} />
				<TextField
					placeholder="Buscar"
					size="small"
					value={search}
					onChange={(e) => { setSearch(e.target.value); setPage(1); }}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchRounded fontSize="small" />
							</InputAdornment>
						),
						sx: { borderRadius: 2, width: 260 }
					}}
				/>
			</Box>

			{/* Tabla */}
			<EntityTable
				rows={paged}
				columns={tab === 0 ? columnsInst : columnsRep}
				loading={false}
				rowCount={rows.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Footer custom idéntico al prototipo */}
			<TableFooter
				page={page}
				pageCount={pageCount}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
			/>
		</Box>
	);
}
