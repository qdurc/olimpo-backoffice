import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  SportsSoccer,
  Event,
  Person,
  EmojiEvents,
  Build,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Instalaciones", icon: <SportsSoccer />, path: "/instalaciones" },
  { text: "Mantenimientos", icon: <Build />, path: "/mantenimientos" },
  { text: "Reservas", icon: <Event />, path: "/reservas" },
  { text: "Usuarios", icon: <Person />, path: "/usuario" },
  { text: "Torneos", icon: <EmojiEvents />, path: "/torneos" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          bgcolor: "#fff",
          borderRight: "1px solid #e5e7eb",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
          🏛️ OLIMPO
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: isActive ? "#f3f4f6" : "transparent",
                mx: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#d32f2f" : "#6b7280",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "#d32f2f" : "inherit",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
