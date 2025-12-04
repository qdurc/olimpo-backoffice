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
					border: "1px solid",
					borderColor: "divider",
					boxShadow: "0 6px 28px rgba(2,8,20,.06)",
					"& .MuiDataGrid-columnHeaders": {
						background: "#f7f8fa",
						backgroundColor: "#f7f8fa",
					},
					"& .MuiDataGrid-columnHeader": {
						background: "#f7f8fa",
						backgroundColor: "#f7f8fa",
					},
					"& .MuiDataGrid-columnHeaderTitle": {
						fontWeight: 700,
						color: "#1f2937",
					},
					"& .MuiDataGrid-cell": { py: 1.25, alignItems: "center" },
					"& .MuiDataGrid-cellContent": {
						overflow: "visible",
						whiteSpace: "normal",
					},
					"& .MuiDataGrid-row:hover": {
						backgroundColor: "rgba(2,8,20,.02)",
					},
				}}
			/>
		</Box>
	);
}
