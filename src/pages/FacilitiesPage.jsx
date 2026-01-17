import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import FacilityModal from "../components/FacilityModal";
import {
	getInstallations,
	clearInstallationsCache,
	createInstallation,
	updateInstallation,
	deleteInstallation,
} from "../services/installations";

export default function FacilitiesPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [instalaciones, setInstalaciones] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [editingInst, setEditingInst] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	React.useEffect(() => {
		if (!error) return;

		const timer = setTimeout(() => {
			setError("");
		}, 8000);

		return () => clearTimeout(timer);
	}, [error]);

	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			setLoading(true);
			try {
				const instData = await getInstallations();
				if (!isMounted) return;
				setInstalaciones(instData);
			} catch (error) {
				console.error("Error loading installations data", error);
				const message =
					error instanceof Error
						? error.message
						: "No se pudieron cargar las instalaciones.";
				if (isMounted) {
					setError(message);
				}
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

	const handleSaveInst = async (inst) => {
		try {
			setLoading(true);
			setError("");

			if (inst.id) {
				await updateInstallation(inst.id, inst);
			} else {
				await createInstallation(inst);
			}

			clearInstallationsCache();
			const fresh = await getInstallations();
			setInstalaciones(fresh);
		} catch (error) {
			console.error("Error saving installation", error);
			const message =
				error instanceof Error
					? error.message
					: "No se pudo guardar la instalación.";
			setError(message);
		} finally {
			setLoading(false);
			setEditingInst(null);
			setOpenModal(false);
		}
	};

	const handleDeleteInst = async (id) => {
		try {
			setLoading(true);
			setError("");

			await deleteInstallation(id);

			clearInstallationsCache();
			const fresh = await getInstallations();
			setInstalaciones(fresh);

		} catch (error) {
			console.error("Error deleting installation", error);
			const message =
				error instanceof Error
					? error.message
					: "No se pudo eliminar la instalación.";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const rows = useMemo(() => {
		const term = search.toLowerCase();

		return instalaciones.filter(
			(r) =>
				r.nombre?.toLowerCase().includes(term) ||
				r.tipo?.toLowerCase?.().includes(term) ||
				r.direccion?.toLowerCase?.().includes(term) ||
				r.estado?.toLowerCase?.().includes(term)
		);
	}, [search, instalaciones]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice(
		(page - 1) * pageSize,
		(page - 1) * pageSize + pageSize
	);

	const columnsInst = useMemo(
		() => [
			{ field: "nombre", headerName: "Nombre", flex: 1 },
			{ field: "tipo", headerName: "Tipo", flex: 1 },
			{ field: "capacidad", headerName: "Capacidad", width: 120 },
			{ field: "direccion", headerName: "Dirección", flex: 1 },
			{
				field: "estado",
				headerName: "Estado",
				width: 160,
				renderCell: (p) => <StatusPill value={p.value} />,
			},
		],
		[]
	);

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Instalaciones"
				subtitle=""
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditingInst(null);
							setOpenModal(true);
						}}
					>
						Nueva Instalación
					</Button>
				}
			/>

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

			{error ? (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			) : null}

			<EntityTable
				rows={paged}
				columns={columnsInst}
				loading={loading}
				rowCount={rows.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
				onEdit={(id) => {
					const selected = instalaciones.find((item) => item.id === id);
					if (selected) {
						setEditingInst(selected);
						setOpenModal(true);
					}
				}}
				onDelete={handleDeleteInst}
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

			{/* Modal para agregar instalación */}
			<FacilityModal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setEditingInst(null);
				}}
				onSave={handleSaveInst}
				initialData={editingInst}
			/>
		</Box>
	);
}
