import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { getDashboardData } from "../services/dashboard";

const cardBorder = "1px solid #e5e7eb";
const neutralText = "#4b5563";

const LegendDot = ({ color }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      bgcolor: color,
      display: "inline-block",
      mr: 1,
    }}
  />
);

const StatCard = ({ title, value, change, trend }) => {
  const isUp = trend === "up";
  const chipColor = isUp ? "#d1fae5" : "#fee2e2";
  const chipText = isUp ? "#0f5132" : "#991b1b";
  return (
    <Paper
      elevation={0}
      sx={{
        border: cardBorder,
        bgcolor: "#fff",
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        height: "100%",
      }}
    >
      <Typography variant="caption" sx={{ color: neutralText }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "#1f2937" }}>
        {value}
      </Typography>
      <Chip
        size="small"
        icon={
          isUp ? (
            <ArrowUpward fontSize="small" sx={{ color: chipText }} />
          ) : (
            <ArrowDownward fontSize="small" sx={{ color: chipText }} />
          )
        }
        label={change}
        sx={{
          alignSelf: "flex-start",
          bgcolor: chipColor,
          color: chipText,
          fontWeight: 700,
          borderRadius: "12px",
          "& .MuiChip-label": { px: 1.5 },
        }}
      />
    </Paper>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState({
    stats: [],
    activity: [],
    classification: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getDashboardData()
      .then((payload) => {
        if (isMounted) {
          setData(payload);
        }
      })
      .catch((error) => console.error("Error loading dashboard data", error))
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { stats, activity, classification, events } = data;

  const currentActivity = useMemo(() => {
    const total = activity.reduce((sum, item) => sum + (item?.value ?? 0), 0);
    const current = activity[0]?.value ?? 0;
    const pct = total ? Math.round((current / total) * 100) : 0;
    return {
      value: pct,
      label: activity[0]?.name ?? "Actual",
    };
  }, [activity]);

  const activityLegend = activity.map((entry, index) => (
    <Typography
      key={entry.name ?? index}
      variant="body2"
      component="div"
      sx={{ color: neutralText, display: "flex", alignItems: "center", gap: 1 }}
    >
      <LegendDot color={entry.color} />
      {entry.name ?? "Dato"}
    </Typography>
  ));

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 4 },
        bgcolor: "transparent",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: "#111827" }}>
        Dashboard
      </Typography>

      {loading && !stats.length && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cargando métricas…
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.6fr 1fr",
          },
          gap: 2,
          width: "100%",
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: cardBorder,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1f2937" }}>
              Actividad
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{activityLegend}</Box>
          </Box>
          <Box sx={{ flex: 1, position: "relative", minHeight: 260, width: "100%" }}>
            <ResponsiveContainer>
              <RadialBarChart
                innerRadius="60%"
                outerRadius="108%"
                data={[
                  {
                    name: currentActivity.label,
                    value: currentActivity.value,
                    fill: "#6b7280",
                  },
                ]}
                startAngle={220}
                endAngle={-40}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  tick={false}
                />
                <RadialBar
                  minAngle={15}
                  background={{ fill: "#e5e7eb" }}
                  cornerRadius={14}
                  dataKey="value"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#374151" }}>
                {currentActivity.value}%
              </Typography>
              <Typography variant="caption" sx={{ color: neutralText }}>
                {currentActivity.label}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: cardBorder,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1f2937" }}>
            Clasificación
          </Typography>
          <Box sx={{ flex: 1, minHeight: 260, width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={classification}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={82}
                  paddingAngle={4}
                >
                  {classification.map((entry, index) => (
                    <Cell key={`classification-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {classification.map((item, index) => (
              <Typography
                key={item.name ?? index}
                variant="body2"
                component="div"
                sx={{ color: neutralText, display: "flex", alignItems: "center", gap: 1 }}
              >
                <LegendDot color={item.color} />
                {item.name ?? "Segmento"} — <strong>{item.value}</strong>
              </Typography>
            ))}
          </Box>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.4fr 1fr",
          },
          gap: 2,
          width: "100%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: cardBorder,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 3,
            height: "100%",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1f2937", mb: 2 }}>
            Próximos eventos y torneos
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f7f8fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: neutralText }}>Evento</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: neutralText }}>Participación</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: neutralText }}>Inscritos</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: neutralText }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((e, i) => (
                  <TableRow key={i} hover sx={{ "&:hover": { bgcolor: "#f3f4f6" } }}>
                    <TableCell sx={{ color: "#111827", fontWeight: 600 }}>{e.evento}</TableCell>
                    <TableCell sx={{ color: neutralText }}>{e.participacion}</TableCell>
                    <TableCell sx={{ color: neutralText }}>{e.inscritos}</TableCell>
                    <TableCell sx={{ color: neutralText }}>{e.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: cardBorder,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1f2937" }}>
            Distribución
          </Typography>
          <Box sx={{ flex: 1, minHeight: 260, width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={classification}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={84}
                  paddingAngle={4}
                >
                  {classification.map((entry, index) => (
                    <Cell key={`outer-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Pie
                  data={activity}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                >
                  {activity.map((entry, index) => (
                    <Cell key={`inner-${index}`} fill={entry.color} opacity={0.7} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {classification.map((item, index) => (
              <Box
                key={item.name ?? index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: neutralText,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LegendDot color={item.color} />
                  <Typography variant="body2" component="div">
                    {item.name ?? "Dato"}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1f2937" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
