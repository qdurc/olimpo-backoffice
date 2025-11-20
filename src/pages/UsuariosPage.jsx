import React, { useEffect, useState } from "react";
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
import { getInstallations } from "../services/installations";

export default function UsuariosPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getInstallations()
      .then((data) => {
        if (isMounted) {
          setInstallations(data);
        }
      })
      .catch((error) => console.error("Error loading installations", error));

    return () => {
      isMounted = false;
    };
  }, []);

  const term = search.toLowerCase();
  const filtered = installations.filter(
    (i) =>
      i.nombre?.toLowerCase().includes(term) ||
      i.tipo?.toLowerCase?.().includes(term) ||
      i.direccion?.toLowerCase?.().includes(term) ||
      i.estado?.toLowerCase?.().includes(term)
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
