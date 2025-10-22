import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function FormDialog({ open, title, children, onClose, onSubmit, submitLabel = "Guardar" }: {
	open: boolean; title: string; children: React.ReactNode; onClose: () => void; onSubmit: () => void; submitLabel?: string;
}) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			<DialogActions>
				<Button onClick={onClose} variant="text">Cancelar</Button>
				<Button onClick={onSubmit} variant="contained">{submitLabel}</Button>
			</DialogActions>
		</Dialog>
	);
}
