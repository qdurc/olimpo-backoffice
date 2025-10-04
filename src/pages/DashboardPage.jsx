import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const stats = [
    {
      title: "Instalaciones registradas",
      value: "7,265",
      change: "+11.01%",
      trend: "up",
      color: "#FFF2F2",
      accent: "#D32F2F",
    },
    {
      title: "Reservas activas",
      value: "3,671",
      change: "-0.03%",
      trend: "down",
      color: "#E8F3FF",
      accent: "#1565C0",
    },
    {
      title: "Usuarios registrados",
      value: "156",
      change: "+15.03%",
      trend: "up",
      color: "#FFECEF",
      accent: "#C2185B",
    },
    {
      title: "Torneos en curso",
      value: "2,318",
      change: "+6.08%",
      trend: "up",
      color: "#E9F3FF",
      accent: "#1976D2",
    },
  ];

  const actividadData = [
    { name: "Usuarios actuales", value: 82.3, color: "#D32F2F" },
    { name: "Nuevos usuarios", value: 17.7, color: "#1565C0" },
  ];

  const clasificacionData = [
    { name: "Entrenadores", value: 25, color: "#D32F2F" },
    { name: "Atletas", value: 80, color: "#1565C0" },
  ];

  const eventos = [
    { evento: "Torneo de Verano", participacion: "17.5%", inscritos: 858, fecha: "7 Jul. 2025" },
    { evento: "Olimpo Basket PRO", participacion: "10.8%", inscritos: 1024, fecha: "5 Jul. 2025" },
    { evento: "Olimpo Natación DS", participacion: "21.3%", inscritos: 258, fecha: "12 Jul. 2025" },
    { evento: "Liga Intercolegial", participacion: "31.5%", inscritos: 1485, fecha: "10 Jul. 2025" },
    { evento: "Carrera Fútbol 2025", participacion: "12.8%", inscritos: 612, fecha: "14 Jul. 2025" },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 4, bgcolor: "#F8F9FB", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      {/* Tarjetas Superiores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: item.color,
                p: 2.5,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: 120,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {item.value}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {item.trend === "up" ? (
                  <ArrowUpward sx={{ color: item.accent, fontSize: 16 }} />
                ) : (
                  <ArrowDownward sx={{ color: item.accent, fontSize: 16 }} />
                )}
                <Typography variant="body2" sx={{ color: item.accent, fontWeight: 500 }}>
                  {item.change}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sección de gráficos */}
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 6 }}>
        {/* Actividad semanal */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#fff",
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0px 3px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Actividad semanal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Usuarios activos en los últimos 7 días
              </Typography>
            </Box>

            {/* Fijar altura del gráfico */}
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={actividadData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {actividadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>+18%</strong> Usuarios diarios
              </Typography>
              <Typography variant="body2">
                <strong>+14%</strong> Nuevos usuarios semanales
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Clasificación de usuarios */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#fff",
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0px 3px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Clasificación de usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Clasificación de usuarios activos
              </Typography>
            </Box>

            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={clasificacionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clasificacionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: "center" }}>
              <Chip
                label="25 Entrenadores"
                sx={{
                  bgcolor: "#D32F2F",
                  color: "#fff",
                  fontWeight: "bold",
                  mr: 1,
                }}
              />
              <Chip
                label="80 Atletas"
                sx={{
                  bgcolor: "#1565C0",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla Inferior */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#fff",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Próximos eventos y torneos
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Evento
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Participación (%)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Inscritos
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Fecha
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventos.map((e, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "#f3f4f6" },
                    transition: "all 0.2s ease",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <TableCell sx={{ color: "#111827" }}>{e.evento}</TableCell>
                  <TableCell sx={{ color: "#111827" }}>{e.participacion}</TableCell>
                  <TableCell sx={{ color: "#111827" }}>{e.inscritos}</TableCell>
                  <TableCell sx={{ color: "#111827" }}>{e.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
