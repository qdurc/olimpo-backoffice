import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import DisciplineModal from "../components/DisciplineModal";
import { createDiscipline, deleteDiscipline, getDisciplines, updateDiscipline } from "../services/disciplines";

export default function DisciplinesPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [search, setSearch] = useState("");
	const [disciplines, setDisciplines] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		let active = true;

		(async () => {
			setLoading(true);
			try {
				const data = await getDisciplines();
				if (active) {
					setDisciplines(data);
				}
			} catch (error) {
				console.error("Error cargando disciplinas", error);
				if (active) {
					setDisciplines([]);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		})();

		return () => {
			active = false;
		};
	}, []);

	const handleSave = async (payload) => {
		try {
			if (payload.id) {
				const updated = await updateDiscipline(payload.id, payload);
				setDisciplines((prev) => prev.map((d) => (d.id === payload.id ? updated : d)));
			} else {
				const created = await createDiscipline(payload);
				setDisciplines((prev) => [...prev, created]);
			}
		} catch (error) {
			console.error("Error guardando disciplina", error);
		} finally {
			setEditing(null);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteDiscipline(id);
			setDisciplines((prev) => prev.filter((d) => d.id !== id));
		} catch (error) {
			console.error("Error eliminando disciplina", error);
		}
	};

	const handleEdit = (id) => {
		const found = disciplines.find((d) => d.id === id);
		if (!found) return;
		setEditing(found);
		setOpenModal(true);
	};

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return disciplines.filter(
			(d) =>
				String(d.id ?? "").toLowerCase().includes(term) ||
				d.descripcion?.toLowerCase?.().includes(term),
		);
	}, [search, disciplines]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

	const columns = useMemo(
		() => [
			{ field: "id", headerName: "ID", width: 120 },
			{ field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 220 },
		],
		[],
	);

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Disciplina"
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditing(null);
							setOpenModal(true);
						}}
					>
						Nueva Disciplina
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
				onEdit={handleEdit}
				onDelete={handleDelete}
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

			<DisciplineModal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setEditing(null);
				}}
				onSave={handleSave}
				initialData={editing}
			/>
		</Box>
	);
}
