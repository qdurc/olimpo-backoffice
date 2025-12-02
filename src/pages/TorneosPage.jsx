import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";

import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import TorneoModal from "../components/TorneoModal";
import {
	createTournament,
	deleteTournament,
	getTournaments,
	updateTournament,
} from "../services/tournaments";
import { getInstallations } from "../services/installations";

export default function TorneosPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [torneos, setTorneos] = useState([]);
	const [installations, setInstallations] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [editingTorneo, setEditingTorneo] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			setLoading(true);
			try {
				const instData = await getInstallations();
				const torneosData = await getTournaments(instData);
				if (!isMounted) return;
				setInstallations(instData);
				setTorneos(torneosData);
			} catch (error) {
				console.error("Error loading tournaments data", error);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadData();
		return () => {
			isMounted = false;
		};
	}, []);

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return torneos.filter(
			(t) =>
				t.nombre?.toLowerCase().includes(term) ||
				t.disciplina?.toLowerCase?.().includes(term) ||
				t.categoria?.toLowerCase?.().includes(term) ||
				t.instalacion?.toLowerCase?.().includes(term),
		);
	}, [search, torneos]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, page * pageSize);

	const columns = useMemo(
		() => [
			{ field: "nombre", headerName: "Nombre", flex: 1, minWidth: 220 },
			{ field: "disciplina", headerName: "Disciplina", flex: 1 },
			{ field: "categoria", headerName: "Categoria", flex: 1 },
			{ field: "fecha", headerName: "Fecha", width: 170 },
			{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 220 },
			{
				field: "estado",
				headerName: "Estado",
				width: 140,
				renderCell: (p) => <StatusPill value={p.value} />,
			},
		],
		[],
	);

	const handleOpenCreate = () => {
		setEditingTorneo(null);
		setOpenModal(true);
	};

	const handleSaveTorneo = async (torneoForm) => {
		try {
			if (editingTorneo?.id) {
				const updated = await updateTournament(editingTorneo.id, torneoForm);
				setTorneos((prev) =>
					prev.map((t) =>
						Number(t.id) === Number(updated.id) ? updated : t,
					),
				);
			} else {
				const created = await createTournament(torneoForm);
				setTorneos((prev) => [...prev, created]);
			}
		} catch (error) {
			console.error("Error saving tournament", error);
		} finally {
			setEditingTorneo(null);
		}
	};

	const handleDeleteTorneo = async (id) => {
		const numericId = typeof id === "number" ? id : Number(id);
		if (!Number.isFinite(numericId)) {
			console.error("Delete requiere un id numérico válido");
			return;
		}

		try {
			await deleteTournament(numericId);
			setTorneos((prev) => prev.filter((t) => Number(t.id) !== numericId));
		} catch (error) {
			console.error("Error deleting tournament", error);
		}
	};

	const handleEditTorneo = (id) => {
		const found = torneos.find((t) => t.id === id);
		if (!found) return;
		setEditingTorneo(found);
		setOpenModal(true);
	};

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Torneos"
				cta={
					<Button variant="contained" onClick={handleOpenCreate}>
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
				loading={loading}
				rowCount={rows.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(n) => {
					setPageSize(n);
					setPage(1);
				}}
				onEdit={handleEditTorneo}
				onDelete={handleDeleteTorneo}
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
				onClose={() => {
					setOpenModal(false);
					setEditingTorneo(null);
				}}
				onSave={handleSaveTorneo}
				initialData={editingTorneo}
				installations={installations}
			/>
		</Box>
	);
}
