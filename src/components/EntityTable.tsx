import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";

type Props = {
	rows: any[];
	columns: GridColDef[];
	loading: boolean;
	rowCount: number;
	page: number;        // 1-based
	pageSize: number;
	onPageChange: (n: number) => void;   // 1-based
	onPageSizeChange: (n: number) => void;
};

export default function EntityTable({
	rows, columns, loading, rowCount, page, pageSize, onPageChange, onPageSizeChange
}: Props) {

	const actionCol: GridColDef = {
		field: "__more",
		headerName: "",
		sortable: false,
		filterable: false,
		align: "right",
		width: 72,
		renderCell: () => (
			<Tooltip title="Acciones">
				<IconButton size="small"><MoreHorizRounded /></IconButton>
			</Tooltip>
		),
	};

	return (
		<DataGrid
			rows={rows}
			columns={[...columns, actionCol]}
			loading={loading}
			autoHeight
			hideFooter
			disableRowSelectionOnClick

			/* ✅ Permite alto automático para que quepan 2 líneas (nombre + rol) */
			getRowHeight={() => "auto"}
			getEstimatedRowHeight={() => 64}

			sx={{
				borderRadius: 3,
				backgroundColor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				boxShadow: "0 6px 28px rgba(2,8,20,.06)",
				"& .MuiDataGrid-columnHeaders": { background: "#FBFCFE" },

				/* ✅ Centra verticalmente el contenido de celdas */
				"& .MuiDataGrid-cell": { py: 1.25, alignItems: "center" },

				/* ✅ Deja de recortar el contenido (el avatar ya no se corta) */
				"& .MuiDataGrid-cellContent": { overflow: "visible", whiteSpace: "normal" },

				/* (Opcional) un pequeño resalte al hover como el prototipo */
				"& .MuiDataGrid-row:hover": { backgroundColor: "rgba(2,8,20,.02)" },
			}}
		/>
	);
}
