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
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Capacidad</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Estado</TableCell>
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
