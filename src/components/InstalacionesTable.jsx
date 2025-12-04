import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import StatusChip from "./StatusChip";

export default function InstalacionesTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f7f8fa" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: "#1f2937" }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1f2937" }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1f2937" }}>Capacidad</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1f2937" }}>Dirección</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1f2937" }}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.tipo}</TableCell>
              <TableCell>{row.capacidad}</TableCell>
              <TableCell>{row.direccion}</TableCell>
              <TableCell>
                <StatusChip estado={row.estado} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
