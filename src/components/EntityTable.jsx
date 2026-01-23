import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import RowActionsMenu from "./RowActionsMenu";

export default function EntityTable({
	rows,
	columns,
	loading,
	onEdit,
	onDelete,
	onHistory,
}) {

	const actionCol = {
		field: "__more",
		headerName: "",
		sortable: false,
		filterable: false,
		align: "right",
		width: 72,
		renderCell: (params) => (
			<RowActionsMenu
				onEdit={onEdit ? () => onEdit(params.id) : undefined}
				onDelete={onDelete ? () => onDelete(params.id) : undefined}
				onHistory={onHistory ? () => onHistory(params.id) : undefined}
			/>
		),
	};

	return (
		<Box>
			<DataGrid
				rows={rows}
				columns={[...columns, actionCol]}
				loading={loading}
				autoHeight
				hideFooter
				disableRowSelectionOnClick
				getRowHeight={() => "auto"}
				getEstimatedRowHeight={() => 64}
				localeText={{
					noRowsLabel: "No hay filas para mostrar",
					columnMenuSortAsc: "Orden ascendente",
					columnMenuSortDesc: "Orden descendente",
					columnMenuUnsort: "Quitar orden",
					columnMenuFilter: "Filtrar",
					columnMenuHideColumn: "Ocultar columna",
					columnMenuManageColumns: "Administrar columnas",
				}}
				sx={{
					borderRadius: 1,
					backgroundColor: "background.paper",
					border: "1px solid #e5e7eb",
					boxShadow: "0 6px 28px rgba(17,24,39,0.06)",
					"& .MuiDataGrid-columnHeaders": {
						background: "#F5F5F5",
						backgroundColor: "#F5F5F5",
					},
					"& .MuiDataGrid-columnHeader": {
						background: "#F5F5F5",
						backgroundColor: "#F5F5F5",
					},
					"& .MuiDataGrid-columnHeaderTitle": {
						fontWeight: 700,
						color: "#111827",
					},
					"& .MuiDataGrid-cell": {
						py: 0.75,
						alignItems: "center",
						color: "#111827",
					},
					"& .MuiDataGrid-cellContent": {
						overflow: "visible",
						whiteSpace: "normal",
					},
					"& .MuiDataGrid-row:hover": {
						backgroundColor: "#F5F5F5",
					},
				}}
			/>
		</Box>
	);
}
