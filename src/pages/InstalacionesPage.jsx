import React, { useMemo, useState } from "react";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import TabsUnderline from "../components/TabsUnderline";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import InstalacionModal from "../components/InstModal";
import { v4 as uuidv4 } from "uuid";

const DATA_INST = [
  {
    id: 1,
    nombre: "Cancha Olímpica #1",
    especialidad: "Baloncesto",
    tipo: "Cancha techada",
    capacidad: 120,
    horarios: "Lun–Vie 8:00 am – 8:00 pm",
    estado: "Mantenimiento",
  },
  {
    id: 3,
    nombre: "Salón de Artes Marciales",
    especialidad: "Karate",
    tipo: "Salón cerrado",
    capacidad: 30,
    horarios: "Lun–Sáb 3:00 pm – 9:00 pm",
    estado: "Disponible",
  },
];

const DATA_REPORTES = [
  {
    id: 11,
    nombre: "Cancha Olímpica #1",
    descripcion: "Daño en tablero",
    fecha: "15/07/2025",
    asignado: 120,
    tipo: "Correctivo",
    estado: "En Proceso",
  },
  {
    id: 12,
    nombre: "Piscina Semiolímpica",
    descripcion: "Fuga de agua",
    fecha: "14/07/2025",
    asignado: 40,
    tipo: "Correctivo",
    estado: "En Proceso",
  },
];

export default function InstalacionesPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [instalaciones, setInstalaciones] = useState([...DATA_INST]);
  const [openModal, setOpenModal] = useState(false);

  // 🔹 Al agregar instalación desde el modal
  const handleAddInst = (inst) => {
    const newInst = {
      id: uuidv4(),
      ...inst,
    };
    setInstalaciones((prev) => [...prev, newInst]);
    setTab(0); // por si estabas en "Reportes"
  };

  const rows = useMemo(() => {
    const base = tab === 0 ? instalaciones : DATA_REPORTES;
    return base.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        r.descripcion?.toLowerCase?.().includes(search.toLowerCase()) ||
        r.especialidad?.toLowerCase?.().includes(search.toLowerCase())
    );
  }, [tab, search, instalaciones]);

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
        loading={false}
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
