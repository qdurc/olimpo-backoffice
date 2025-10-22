import { Box, TextField, Select, MenuItem, Chip, IconButton, Tooltip } from "@mui/material";
import ClearAllRounded from "@mui/icons-material/ClearAllRounded";

export default function FilterBar({ search, onSearch, estado, onEstado, extras = [], onClear }: {
	search: string; onSearch: (v: string) => void;
	estado?: string; onEstado?: (v: string) => void;
	extras?: React.ReactNode[]; onClear?: () => void;
}) {
	return (
		<Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
			<TextField placeholder="Buscar…" value={search} onChange={(e) => onSearch(e.target.value)} />
			{onEstado && (
				<Select value={estado ?? ""} onChange={(e) => onEstado(e.target.value)} displayEmpty sx={{ minWidth: 160 }}>
					<MenuItem value=""><em>Todos los estados</em></MenuItem>
					<MenuItem value="disponible">Disponible</MenuItem>
					<MenuItem value="mantenimiento">Mantenimiento</MenuItem>
					<MenuItem value="ocupado">Ocupado</MenuItem>
				</Select>
			)}
			{extras}
			<Chip label="Filtros activos" variant="outlined" />
			{onClear && (
				<Tooltip title="Limpiar filtros">
					<IconButton onClick={onClear}><ClearAllRounded /></IconButton>
				</Tooltip>
			)}
		</Box>
	);
}
