import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import ManagerModal from "../components/ManagerModal";
import { createManager, deleteManager, getManagers, updateManager } from "../services/managers";

export default function ManagersPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [search, setSearch] = useState("");
	const [managers, setManagers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		let active = true;

		(async () => {
			setLoading(true);
			try {
				const data = await getManagers();
				if (active) {
					setManagers(data);
				}
			} catch (error) {
				console.error("Error cargando encargados", error);
				if (active) {
					setManagers([]);
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
			setLoading(true);

			if (payload.id) {
				await updateManager(payload.id, payload);
			} else {
				await createManager(payload);
			}

			const fresh = await getManagers();
			setManagers(fresh);

			setEditing(null);
			setOpenModal(false);
		} catch (error) {
			console.error("Error guardando encargado", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			setLoading(true);

			await deleteManager(id);

			const fresh = await getManagers();
			setManagers(fresh);
		} catch (error) {
			console.error("Error eliminando encargado", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (id) => {
		const found = managers.find((m) => m.id === id);
		if (!found) return;
		setEditing(found);
		setOpenModal(true);
	};

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return managers.filter(
			(m) =>
				String(m.id ?? "").toLowerCase().includes(term) ||
				m.nombreCompleto?.toLowerCase?.().includes(term) ||
				m.cedula?.toLowerCase?.().includes(term) ||
				m.fechaNacimiento?.toLowerCase?.().includes(term),
		);
	}, [search, managers]);

	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const paged = rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

	const columns = useMemo(
		() => [
			{ field: "id", headerName: "ID", width: 120 },
			{ field: "nombreCompleto", headerName: "Nombre completo", flex: 1, minWidth: 240 },
			{
				field: "fechaNacimiento",
				headerName: "Fecha de Nacimiento",
				width: 180,

				renderCell: (p) => {
					if (!p.value) return "";

					const date = new Date(p.value);

					if (Number.isNaN(date.getTime())) return p.value;

					return date.toLocaleDateString("en-US", {
						timeZone: "UTC",
					});
				},
			},
			{ field: "cedula", headerName: "Cédula", width: 180 },
		],
		[],
	);

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Encargados"
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditing(null);
							setOpenModal(true);
						}}
					>
						Nuevo Encargado
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

			<ManagerModal
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
