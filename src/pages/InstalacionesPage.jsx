import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import InstalacionModal from "../components/InstModal";
import { getInstallations, createInstallation } from "../services/installations";

export default function InstalacionesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [instalaciones, setInstalaciones] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const instData = await getInstallations();
        if (!isMounted) return;
        setInstalaciones(instData);
      } catch (error) {
        console.error("Error loading installations data", error);
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

  // 🔹 Al agregar instalación desde el modal
  const handleAddInst = async (inst) => {
    try {
      const newInst = await createInstallation(inst);
      setInstalaciones((prev) => [...prev, newInst]);
    } catch (error) {
      console.error("Error creating installation", error);
    }
  };

  const rows = useMemo(() => {
    const term = search.toLowerCase();

    return instalaciones.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(term) ||
        r.tipo?.toLowerCase?.().includes(term) ||
        r.direccion?.toLowerCase?.().includes(term) ||
        r.estado?.toLowerCase?.().includes(term)
    );
  }, [search, instalaciones]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  const columnsInst = useMemo(
    () => [
      { field: "nombre", headerName: "Nombre", flex: 1 },
      { field: "tipo", headerName: "Tipo", flex: 1 },
      { field: "capacidad", headerName: "Capacidad", width: 120 },
      { field: "direccion", headerName: "Dirección", flex: 1 },
      {
        field: "estado",
        headerName: "Estado",
        width: 160,
        renderCell: (p) => <StatusPill value={p.value} />,
      },
    ],
    []
  );

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
      <PageHeader
        title="Instalaciones"
        subtitle=""
        cta={
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Nueva Instalación
          </Button>
        }
      />

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
        columns={columnsInst}
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

      {/* Modal para agregar instalación */}
      <InstalacionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddInst}
      />
    </Box>
  );
}
