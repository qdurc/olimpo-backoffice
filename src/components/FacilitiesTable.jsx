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

export default function FacilitiesTable({ data }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: "#F5F5F5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: "#111827" }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#111827" }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#111827" }}>Capacidad</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#111827" }}>Dirección</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#111827" }}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} hover>
              <TableCell sx={{ color: "#111827" }}>{row.nombre}</TableCell>
              <TableCell sx={{ color: "#111827" }}>{row.tipo}</TableCell>
              <TableCell sx={{ color: "#111827" }}>{row.capacidad}</TableCell>
              <TableCell sx={{ color: "#111827" }}>{row.direccion}</TableCell>
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
