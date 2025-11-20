import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import { getReservations } from "../services/reservations";

export default function ReservasPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		getReservations()
			.then((data) => {
				if (isMounted) {
					setReservations(data);
				}
			})
			.catch((error) => console.error("Error loading reservations data", error))
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		return reservations.filter(
			(r) =>
				r.instalacion?.toLowerCase().includes(term) ||
				r.estado?.toLowerCase?.().includes(term) ||
				r.usuarioId?.toString().includes(term) ||
				r.id?.toString().includes(term),
		);
	}, [reservations, search]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const columns = useMemo(
		() => [
			{ field: "id", headerName: "ID", width: 90 },
			{ field: "usuarioId", headerName: "Usuario", width: 130 },
			{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 200 },
			{ field: "fecha", headerName: "Fecha", width: 130 },
			{ field: "hora", headerName: "Hora", width: 120 },
			{ field: "estado", headerName: "Estado", width: 150, renderCell: (p) => <StatusPill value={p.value} /> },
		],
		[],
	);

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader title="Reservas" cta={false} />

			<Box display="flex" alignItems="center" justifyContent="flex-end" mb={1.5}>
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
