import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import { getReservations } from "../services/reservations";

export default function ReservasPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(7);
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		getReservations()
			.then((data) => {
				if (isMounted) {
					setReservations(data);
				}
			})
			.catch((error) => console.error("Error loading reservations", error))
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const pageCount = Math.max(1, Math.ceil(reservations.length / pageSize));
	const rows = useMemo(
		() => reservations.slice((page - 1) * pageSize, page * pageSize),
		[reservations, page, pageSize],
	);

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
				loading={loading}
				rowCount={reservations.length}
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
