// src/components/EmptyState.tsx
import { Box, Typography, Button } from "@mui/material";

export default function EmptyState({ title, subtitle, action }: {
	title: string; subtitle?: string; action?: React.ReactNode;
}) {
	return (
		<Box textAlign="center" p={6} bgcolor="background.paper" borderRadius={3} border="1px solid" borderColor="divider">
			<Typography variant="h3" gutterBottom>{title}</Typography>
			{subtitle && <Typography color="text.secondary" mb={2}>{subtitle}</Typography>}
			{action}
		</Box>
	);
}
