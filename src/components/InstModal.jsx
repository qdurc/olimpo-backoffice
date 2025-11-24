import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function InstalacionModal({ open, onClose, onAdd }) {
  const initialForm = {
    nombre: "",
    tipo: "",
    capacidad: "",
    direccion: "",
    estadoId: "1",
    estado: "Disponible",
  };
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.nombre.trim()) return;

    const estadoId = form.estadoId === "" ? null : form.estadoId;

    onAdd({
      ...form,
      capacidad: Number(form.capacidad) || 0,
      estadoId,
    });

    setForm(initialForm);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
        Nueva Instalación
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 2,
          px: 3,
          pb: 2,
          "& .MuiTextField-root": { mt: 1 },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={form.nombre}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Tipo"
              name="tipo"
              fullWidth
              value={form.tipo}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Capacidad"
              name="capacidad"
              type="number"
              fullWidth
              value={form.capacidad}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Dirección"
              name="direccion"
              fullWidth
              value={form.direccion}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Estado (ID numérico)"
              name="estadoId"
              type="number"
              fullWidth
              value={form.estadoId}
              onChange={handleChange}
            />
          </Grid>

          {/* 👇 Campo de Estado como dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                label="Estado"
                value={form.estado}
                onChange={handleChange}
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="Bloqueada">Bloqueada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
