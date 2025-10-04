import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import InstalacionesTable from "../components/InstalacionesTable";

export default function UsuariosPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const instalaciones = [
    { nombre: "Cancha Olímpica #1", especialidad: "Baloncesto", tipo: "Cancha techada", capacidad: 120, horarios: "Lun-Vie 8:00 am – 8:00 pm", estado: "Mantenimiento" },
    { nombre: "Piscina Semiolímpica", especialidad: "Natación", tipo: "Piscina", capacidad: 40, horarios: "Mar-Dom 7:00 am – 5:00 pm", estado: "Mantenimiento" },
    { nombre: "Salón de Artes Marciales", especialidad: "Karate", tipo: "Salón cerrado", capacidad: 30, horarios: "Lun-Sáb 3:00 pm – 9:00 pm", estado: "Disponible" },
    { nombre: "Campo de fútbol externo", especialidad: "Fútbol", tipo: "Campo abierto", capacidad: 150, horarios: "Lun-Vie 2:00 pm – 10:00 pm", estado: "Disponible" },
    { nombre: "Gimnasio multiuso", especialidad: "General", tipo: "Salón techado", capacidad: 100, horarios: "Todos los días 6:00 am – 9:00 pm", estado: "Bloqueada" },
  ];

  const filtered = instalaciones.filter((i) =>
    i.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Usuarios
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label="Nueva Instalación" />
        <Tab label="Reportes de Mantenimiento" />
      </Tabs>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250, bgcolor: "white" }}
        />
      </Box>

      <InstalacionesTable data={filtered} />
    </Box>
  );
}
