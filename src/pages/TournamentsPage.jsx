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

import { getTournamentViewModel } from "../services/tournamentViewModel";

export default function TournamentsPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);

	const [torneos, setTorneos] = useState([]);
	const [viewModel, setViewModel] = useState({
		facilities: [],
		estatus: [],
		categories: [],
		disciplines: [],
		encargados: [],
		users: [],
	});

	const [openModal, setOpenModal] = useState(false);
	const [editingTorneo, setEditingTorneo] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			setLoading(true);
			try {
				const vm = await getTournamentViewModel();
				const torneosData = await getTournaments(vm.facilities);
				if (!isMounted) return;
				setViewModel(vm);
				setTorneos(torneosData);
			} catch (error) {
				console.error("Error loading tournaments data", error);
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		loadData();
		return () => {
			isMounted = false;
		};
	}, []);

	const refreshTorneos = async () => {
		setLoading(true);
		try {
			const fresh = await getTournaments(viewModel.facilities);
			setTorneos(fresh);
		} catch (error) {
			console.error("Error recargando torneos", error);
			setTorneos([]);
		} finally {
			setLoading(false);
		}
	};

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return torneos.filter(
			(t) =>
				t.nombre?.toLowerCase().includes(term) ||
				t.disciplina?.toLowerCase?.().includes(term) ||
				t.categoria?.toLowerCase?.().includes(term) ||
				t.instalacion?.toLowerCase?.().includes(term) ||
				t.supervisor?.toLowerCase?.().includes(term) ||
				t.descripcion?.toLowerCase?.().includes(term) ||
				t.normas?.toLowerCase?.().includes(term) ||
				t.usuarioId?.toString().includes(term) ||
				t.usuario?.toLowerCase?.().includes(term)
		);
	}, [search, torneos]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, page * pageSize);

	const columns = useMemo(
		() => [
			{ field: "nombre", headerName: "Nombre", flex: 1.1, minWidth: 150 },
			{ field: "disciplina", headerName: "Disciplina", flex: 1, minWidth: 110 },
			{ field: "categoria", headerName: "Categoría", flex: 0.9, minWidth: 110 },
			{ field: "descripcion", headerName: "Descripción", flex: 1.1, minWidth: 140 },
			{ field: "normas", headerName: "Normas", flex: 1, minWidth: 130 },
			{ field: "fecha", headerName: "Fecha", flex: 1, minWidth: 140 },
			{ field: "endFecha", headerName: "Fin", flex: 1, minWidth: 140 },
			{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 130 },
			{ field: "supervisor", headerName: "Encargado", flex: 1, minWidth: 120 },
			{ field: "usuario", headerName: "Usuario", flex: 0.8, minWidth: 120 },
			{
				field: "estado",
				headerName: "Estado",
				minWidth: 100,
				flex: 0.8,
				renderCell: (p) => <StatusPill value={p.value} />,
			},
		],
		[]
	);

	const handleOpenCreate = () => {
		setEditingTorneo(null);
		setOpenModal(true);
	};

	const handleSaveTorneo = async (torneoForm) => {
		try {
			setLoading(true);

			if (editingTorneo?.id) {
				await updateTournament(editingTorneo.id, torneoForm);
			} else {
				await createTournament(torneoForm);
			}

			const fresh = await getTournaments(viewModel.facilities);
			setTorneos(fresh);

			setEditingTorneo(null);
			setOpenModal(false);
		} catch (error) {
			console.error("Error saving tournament", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteTorneo = async (id) => {
		const numericId = Number(id);
		if (!Number.isFinite(numericId)) {
			console.error("Delete requiere un id numérico válido");
			return;
		}

		try {
			setLoading(true);

			await deleteTournament(numericId);

			const fresh = await getTournaments(viewModel.facilities);
			setTorneos(fresh);
		} catch (error) {
			console.error("Error deleting tournament", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEditTorneo = (id) => {
		const found = torneos.find((t) => Number(t.id) === Number(id));
		if (!found) return;
		setEditingTorneo(found);
		setOpenModal(true);
	};

	return (
		<Box sx={{ px: { xs: 2, md: 3 } }}>
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
				viewModel={viewModel}
			/>
		</Box>
	);
}
