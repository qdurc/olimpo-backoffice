import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import ReservationModal from "../components/ReservationModal";
import {
	createReservation,
	deleteReservation,
	getReservations,
	updateReservation,
	reservationStatuses,
} from "../services/reservations";
import { getInstallations } from "../services/installations";
import { getUsers } from "../services/users";

export default function ReservationsPage() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [editing, setEditing] = useState(null);
	const [installations, setInstallations] = useState([]);
	const [users, setUsers] = useState([]);
	const [openModal, setOpenModal] = useState(false);

	const userNameById = useMemo(() => {
		const map = new Map();
		users.forEach((u) => {
			const idNum = Number(u.id);
			if (!Number.isNaN(idNum)) {
				map.set(idNum, u.nombre);
			}
		});
		return map;
	}, [users]);

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		(async () => {
			try {
				const [instData, usersData] = await Promise.all([
					getInstallations(),
					getUsers(),
				]);

				const resData = await getReservations(instData);

				if (!isMounted) return;

				setInstallations(instData);
				setUsers(usersData);
				setReservations(resData);
			} catch (error) {
				console.error("Error loading reservations data", error);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);


	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		return reservations.filter((r) => {
			const userName = userNameById.get(Number(r.usuarioId)) || "";
			return (
				r.instalacion?.toLowerCase().includes(term) ||
				r.estado?.toLowerCase?.().includes(term) ||
				userName.toLowerCase().includes(term) ||
				r.usuarioId?.toString().includes(term) ||
				r.id?.toString().includes(term)
			);
		});
	}, [reservations, search, userNameById]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);


	const columns = useMemo(
		() => [
			{ field: "id", headerName: "ID", width: 90 },
			{
				field: "usuarioId",
				headerName: "Usuario",
				width: 180,
				renderCell: (params) => {
					const idNum = Number(params.row.usuarioId);
					const name = userNameById.get(idNum);
					return name || params.row.usuarioId || "";
				},
			},
			{ field: "instalacion", headerName: "Instalación", flex: 1, minWidth: 200 },
			{ field: "fecha", headerName: "Fecha", width: 130 },
			{ field: "hora", headerName: "Hora", width: 120 },
			{ field: "endFecha", headerName: "Fin Fecha", width: 130 },
			{ field: "endHora", headerName: "Fin Hora", width: 120 },
			{
				field: "estado",
				headerName: "Estado",
				width: 150,
				renderCell: (p) => <StatusPill value={p.value} />,
			},
		],
		[userNameById],
	);

	const handleSave = async (data) => {
		try {
			setLoading(true);

			if (data.id) {
				await updateReservation(data.id, data);
			} else {
				await createReservation(data);
			}

			const fresh = await getReservations(installations);
			setReservations(fresh);

			setEditing(null);
			setOpenModal(false);
		} catch (error) {
			console.error("Error saving reservation", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		const numericId = typeof id === "number" ? id : Number(id);
		if (!Number.isFinite(numericId)) {
			console.error("Delete requiere un id numérico válido");
			return;
		}

		try {
			setLoading(true);

			await deleteReservation(numericId);

			const fresh = await getReservations(installations);
			setReservations(fresh);
		} catch (error) {
			console.error("Error deleting reservation", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
			<PageHeader
				title="Reservas"
				cta={
					<Button
						variant="contained"
						onClick={() => {
							setEditing(null);
							setOpenModal(true);
						}}
					>
						Nueva reserva
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

			<EntityTable
				rows={rows}
				columns={columns}
				loading={loading}
				rowCount={filtered.length}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
				onEdit={(id) => {
					const selected = reservations.find((item) => item.id === id);
					if (selected) {
						setEditing(selected);
						setOpenModal(true);
					}
				}}
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

			<ReservationModal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setEditing(null);
				}}
				onSave={handleSave}
				installations={installations}
				statuses={reservationStatuses}
				users={users}
				initialData={editing}
			/>
		</Box>
	);
}
