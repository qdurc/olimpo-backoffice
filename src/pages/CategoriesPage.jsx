import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import CategoryModal from "../components/CategoryModal";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/categories";

export default function CategoriesPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [search, setSearch] = useState("");
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		let active = true;

		(async () => {
			setLoading(true);
			try {
				const data = await getCategories();
				if (active) {
					setCategories(data);
				}
			} catch (error) {
				console.error("Error cargando categorías", error);
				if (active) {
					setCategories([]);
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
				const updated = await updateCategory(payload.id, payload);
				setCategories((prev) => prev.map((c) => (c.id === payload.id ? updated : c)));
			} else {
				const created = await createCategory(payload);
				setCategories((prev) => [...prev, created]);
			}
		} catch (error) {
			console.error("Error guardando categoría", error);
		} finally {
			setEditing(null);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteCategory(id);
			setCategories((prev) => prev.filter((c) => c.id !== id));
		} catch (error) {
			console.error("Error eliminando categoría", error);
		}
	};

	const handleEdit = (id) => {
		const found = categories.find((c) => c.id === id);
		if (!found) return;
		setEditing(found);
		setOpenModal(true);
	};

	const rows = useMemo(() => {
		const term = search.toLowerCase();
		return categories.filter(
			(c) =>
				String(c.id ?? "").toLowerCase().includes(term) ||
				c.descripcion?.toLowerCase?.().includes(term),
		);
	}, [search, categories]);

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
				title="Categoría"
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditing(null);
							setOpenModal(true);
						}}
					>
						Nueva Categoría
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

			<CategoryModal
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
