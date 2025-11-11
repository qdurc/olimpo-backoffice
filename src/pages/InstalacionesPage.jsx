import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import TabsUnderline from "../components/TabsUnderline";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import InstalacionModal from "../components/InstModal";
import {
	getInstallations,
	getInstallationReports,
	createInstallation,
} from "../services/installations";

export default function InstalacionesPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [instalaciones, setInstalaciones] = useState([]);
  const [reports, setReports] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const [instData, reportData] = await Promise.all([
          getInstallations(),
          getInstallationReports(),
        ]);
        if (!isMounted) return;
        setInstalaciones(instData);
        setReports(reportData);
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
      setTab(0); // por si estabas en "Reportes"
    } catch (error) {
      console.error("Error creating installation", error);
    }
  };

  const rows = useMemo(() => {
    const base = tab === 0 ? instalaciones : reports;
    return base.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        r.descripcion?.toLowerCase?.().includes(search.toLowerCase()) ||
        r.especialidad?.toLowerCase?.().includes(search.toLowerCase())
    );
  }, [tab, search, instalaciones, reports]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  const columnsInst = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "especialidad", headerName: "Especialidad", flex: 1 },
    { field: "tipo", headerName: "Tipo", flex: 1 },
    { field: "capacidad", headerName: "Capacidad", width: 120 },
    { field: "horarios", headerName: "Horarios", flex: 1 },
    {
      field: "estado",
      headerName: "Estado",
      width: 160,
      renderCell: (p) => <StatusPill value={p.value} />,
    },
  ];

  const columnsRep = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "fecha", headerName: "Fecha", width: 140 },
    { field: "asignado", headerName: "Asignado", width: 120 },
    { field: "tipo", headerName: "Tipo", width: 140 },
    {
      field: "estado",
      headerName: "Estado",
      width: 160,
      renderCell: (p) => <StatusPill value={p.value} />,
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
      <PageHeader
        title="Instalaciones"
        subtitle=""
        cta={
          tab === 0 && ( 
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Nueva Instalación
            </Button>
          )
        }
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <TabsUnderline
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
          items={["Instalaciones", "Reportes de Mantenimiento"]}
        />
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
        key={tab === 0 ? instalaciones.length : "reportes"}
        rows={paged}
        columns={tab === 0 ? columnsInst : columnsRep}
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
