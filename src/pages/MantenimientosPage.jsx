import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import { getMaintenances } from "../services/maintenances";

export default function MantenimientosPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const data = await getMaintenances();
        if (!isMounted) return;
        setMantenimientos(data);
      } catch (error) {
        console.error("Error loading maintenance data", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    const term = search.toLowerCase();

    return mantenimientos.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(term) ||
        r.descripcion?.toLowerCase?.().includes(term) ||
        r.usuarioId?.toString().includes(term)
    );
  }, [search, mantenimientos]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  const columns = useMemo(
    () => [
      { field: "nombre", headerName: "Instalación", flex: 1 },
      { field: "descripcion", headerName: "Descripción", flex: 1 },
      { field: "inicio", headerName: "Inicio", width: 180 },
      { field: "fin", headerName: "Fin", width: 180 },
      { field: "usuarioId", headerName: "Usuario", width: 120 },
    ],
    []
  );

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
      <PageHeader title="Mantenimientos" subtitle="" />

      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1.5}>
        <TextField
          placeholder="Buscar"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, width: 260 },
          }}
        />
      </Box>

      <EntityTable
        rows={paged}
        columns={columns}
        loading={loading}
        rowCount={rows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <TableFooter
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />
    </Box>
  );
}
