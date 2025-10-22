import * as React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Pagination } from "@mui/material";

export default function TableFooter({
	page, pageCount, pageSize, onPageChange, onPageSizeChange,
}: {
	page: number; pageCount: number; pageSize: number;
	onPageChange: (n: number) => void; onPageSizeChange: (n: number) => void;
}) {
	return (
		<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
			<Box display="flex" alignItems="center" gap={1.5}>
				<Typography variant="body2" color="text.secondary">Show result:</Typography>
				<FormControl size="small">
					<Select
						value={pageSize}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						sx={{ minWidth: 72 }}
					>
						{[8, 10, 20, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
					</Select>
				</FormControl>
			</Box>
			<Pagination
				page={page}
				count={pageCount}
				shape="rounded"
				onChange={(_, n) => onPageChange(n)}
			/>
		</Box>
	);
}
