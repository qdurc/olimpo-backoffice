import { Box, Typography, Breadcrumbs, Button } from "@mui/material";

export default function PageHeader({ title, subtitle, crumbs = [], cta }: {
	title: string; subtitle?: string; crumbs?: Array<{ label: string; onClick?: () => void }>; cta?: React.ReactNode
}) {
	return (
		<Box mb={3} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
			<Box>
				{!!crumbs.length && (
					<Breadcrumbs sx={{ mb: 1 }}>
						{crumbs.map((c, i) => <Typography key={i} variant="body2" color="text.secondary">{c.label}</Typography>)}
					</Breadcrumbs>
				)}
				<Typography variant="h2">{title}</Typography>
				{subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
			</Box>
			{cta ?? <Button variant="contained">Nuevo</Button>}
		</Box>
	);
}
