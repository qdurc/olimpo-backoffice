import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";

const DATA = [
	{ id: 1, nombre: "María González", rol: "Atleta", instalacion: "Cancha Olímpica #1", fecha: "18/07/2025", hora: "4:00 pm – 6:00 pm", comentario: "Partido de práctica con equipo local", estado: "Aprobada", foto: "https://i.pravatar.cc/32?img=11" },
	{ id: 2, nombre: "Juan Pérez", rol: "Atleta", instalacion: "Piscina Semiolímpica", fecha: "19/07/2025", hora: "9:00 am – 10:30 am", comentario: "Entrenamiento precompetencia", estado: "Pendiente", foto: "https://i.pravatar.cc/32?img=12" },
	{ id: 3, nombre: "Rosa Martínez", rol: "Entrenador", instalacion: "Salón de Artes Marciales", fecha: "20/07/2025", hora: "5:00 pm – 7:00 pm", comentario: "Clase extra para alumnos de cinta azul", estado: "Cancelada", foto: "https://i.pravatar.cc/32?img=13" },
	{ id: 4, nombre: "Carlos Rodríguez", rol: "Atleta", instalacion: "Campo de fútbol externo", fecha: "21/07/2025", hora: "3:00 pm – 5:00 pm", comentario: "Torneo escolar nivel B", estado: "Aprobada", foto: "https://i.pravatar.cc/32?img=14" },
	{ id: 5, nombre: "Laura Jiménez", rol: "Atleta", instalacion: "Gimnasio multiuso", fecha: "18/07/2025", hora: "7:00 am – 8:00 am", comentario: "Uso personal (cardio y pesas)", estado: "Rechazada", foto: "https://i.pravatar.cc/32?img=15" },
	{ id: 6, nombre: "Pedro Méndez", rol: "Atleta", instalacion: "Sala de tenis de mesa", fecha: "19/07/2025", hora: "10:00 am – 11:00 am", comentario: "Entrenamiento con nuevo compañero", estado: "Pendiente", foto: "https://i.pravatar.cc/32?img=16" },
	{ id: 7, nombre: "Ana Castillo", rol: "Atleta", instalacion: "Pista de atletismo", fecha: "22/07/2025", hora: "6:00 am – 7:00 am", comentario: "Series de velocidad (pretemporada)", estado: "Aprobada", foto: "https://i.pravatar.cc/32?img=17" },
];

export default function ReservasPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(7);

	const pageCount = Math.max(1, Math.ceil(DATA.length / pageSize));
	const rows = useMemo(() => DATA.slice((page - 1) * pageSize, page * pageSize), [page, pageSize]);

	const columns = [
		{
			field: "nombre",
			headerName: "Nombre",
			flex: 1,
			minWidth: 260,
			renderCell: (p) => (
				<Box display="flex" alignItems="center" gap={1.5}>
					<img src={p.row.foto} alt={p.row.nombre} width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} />
					<Box>
						<Box sx={{ fontWeight: 600 }}>{p.row.nombre}</Box>
						<Box sx={{ fontSize: 13, color: "text.secondary" }}>{p.row.rol}</Box>
					</Box>
				</Box>
			),
		},
		{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 200 },
		{ field: "fecha", headerName: "Fecha", width: 130 },
		{ field: "hora", headerName: "Hora", width: 160 },
		{ field: "comentario", headerName: "Comentario", flex: 1, minWidth: 260 },
		{ field: "estado", headerName: "Estado", width: 150, renderCell: (p) => <StatusPill value={p.value} /> },
	];

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader title="Reservas" cta={false} />

			<EntityTable
				rows={rows}
				columns={columns}
				loading={false}
				rowCount={DATA.length}
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
