import { Chip } from "@mui/material";

export default function StatusChip({ estado }) {
  const colors = {
    Disponible: { color: "success", label: "Disponible" },
    Mantenimiento: { color: "warning", label: "Mantenimiento" },
    Bloqueada: { color: "error", label: "Bloqueada" },
  };

  const item = colors[estado] || { color: "default", label: estado };

  return (
    <Chip
      label={item.label}
      color={item.color}
      variant="outlined"
      sx={{
        fontWeight: "bold",
        borderWidth: 1.3,
        borderColor:
          item.color === "success"
            ? "#2e7d32"
            : item.color === "warning"
            ? "#ed6c02"
            : item.color === "error"
            ? "#d32f2f"
            : "#9e9e9e",
      }}
    />
  );
}
