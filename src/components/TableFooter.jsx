import { Box, FormControl, MenuItem, Select, Typography, Pagination } from "@mui/material";

export default function TableFooter({
	page, pageCount, pageSize, onPageChange, onPageSizeChange,
}) {
	return (
		<Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
			<Box display="flex" alignItems="center" gap={1.5}>
				<Typography variant="body2" sx={{ color: "#000000" }}>Mostrar resultados:</Typography>
				<FormControl size="small">
					<Select
						value={pageSize}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						sx={{ minWidth: 72 }}
					>
						{[8, 10, 20, 50].map((n) => (
							<MenuItem key={n} value={n}>
								{n}
							</MenuItem>
						))}
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
