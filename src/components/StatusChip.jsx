import { Chip } from "@mui/material";

export default function StatusChip({ estado }) {
  const colors = {
    Disponible: { color: "#00205B", border: "#00205B", label: "Disponible" },
    Mantenimiento: { color: "#3366CC", border: "#3366CC", label: "Mantenimiento" },
    Bloqueada: { color: "#ED1C24", border: "#ED1C24", label: "Bloqueada" },
  };

  const item = colors[estado] || { color: "#00205B", border: "#C0C0C0", label: estado };

  return (
    <Chip
      label={item.label}
      variant="outlined"
      sx={{
        fontWeight: "bold",
        borderWidth: 1.3,
        borderColor: item.border,
        color: item.color,
      }}
    />
  );
}
