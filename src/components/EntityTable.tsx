import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import RowActionsMenu from "./RowActionsMenu";

type Props = {
	rows: any[];
	columns: GridColDef[];
	loading: boolean;
	rowCount: number;
	page: number;        // 1-based
	pageSize: number;
	onPageChange: (n: number) => void;   // 1-based
	onPageSizeChange: (n: number) => void;
	onEdit?: (id: number | string) => void;
	onDelete?: (id: number | string) => void;
};

export default function EntityTable({
	rows,
	columns,
	loading,
	rowCount,
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	onEdit,
	onDelete,
}: Props) {

	const actionCol: GridColDef = {
		field: "__more",
		headerName: "",
		sortable: false,
		filterable: false,
		align: "right",
		width: 72,
		renderCell: (params) => (
			<RowActionsMenu
				onEdit={onEdit ? () => onEdit(params.id as number | string) : undefined}
				onDelete={onDelete ? () => onDelete(params.id as number | string) : undefined}
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
					"& .MuiDataGrid-cell": { py: 1.25, alignItems: "center", color: "#111827" },
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
