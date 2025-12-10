import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import PageHeader from "../components/PageHeader";
import EntityTable from "../components/EntityTable";
import TableFooter from "../components/TableFooter";
import StatusPill from "../components/StatusPill";
import MaintenanceModal from "../components/MaintenanceModal";
import {
  createMaintenance,
  deleteMaintenance,
  getMaintenances,
  updateMaintenance,
  maintenanceStatuses,
} from "../services/maintenances";
import { getInstallations } from "../services/installations";

export default function MaintenancePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const instData = await getInstallations();
        const maintData = await getMaintenances(instData);
        if (!isMounted) return;
        setInstalaciones(instData);
        setMantenimientos(maintData);
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
        r.usuarioId?.toString().includes(term) ||
        r.estado?.toLowerCase?.().includes(term)
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
      {
        field: "inicio",
        headerName: "Inicio",
        width: 190,
        renderCell: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "",
      },
      {
        field: "fin",
        headerName: "Fin",
        width: 190,
        renderCell: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "",
      },
      { field: "usuarioId", headerName: "Usuario", width: 120 },
      {
        field: "estado",
        headerName: "Estado",
        width: 140,
        renderCell: (p) => <StatusPill value={p.value} />,
      },
    ],
    []
  );

  const handleSave = async (data) => {
    try {
      if (data.id) {
        const updated = await updateMaintenance(data.id, data);
        setMantenimientos((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const created = await createMaintenance(data);
        setMantenimientos((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Error saving maintenance", error);
    } finally {
      setEditing(null);
    }
  };

  const handleDelete = async (id) => {
    const numericId = typeof id === "number" ? id : Number(id);
    if (!Number.isFinite(numericId)) {
      console.error("Delete requiere un id numérico válido");
      return;
    }

    try {
      await deleteMaintenance(numericId);
      setMantenimientos((prev) =>
        prev.filter((item) => Number(item.id) !== numericId)
      );
    } catch (error) {
      console.error("Error deleting maintenance", error);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, pr: { md: 4 } }}>
      <PageHeader
        title="Mantenimientos"
        subtitle=""
        cta={
          <Button
            variant="contained"
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            Nuevo mantenimiento
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
        columns={columns}
        loading={loading}
        rowCount={rows.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={(id) => {
          const selected = mantenimientos.find((item) => item.id === id);
          if (selected) {
            setEditing(selected);
            setOpenModal(true);
          }
        }}
        onDelete={handleDelete}
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

      <MaintenanceModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditing(null);
        }}
        onSave={handleSave}
        installations={instalaciones}
        statuses={maintenanceStatuses}
        initialData={editing}
      />
    </Box>
  );
}
