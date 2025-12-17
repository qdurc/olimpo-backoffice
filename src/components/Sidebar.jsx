import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ButtonBase,
} from "@mui/material";
import {
  Dashboard,
  Event,
  Person,
  EmojiEvents,
  Build,
  HolidayVillage,
  SportsBasketball,
  AssignmentInd,
  Category,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Miderec-logo-2020.png";
import { logout } from "../services/auth";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Instalaciones", icon: <HolidayVillage />, path: "/instalaciones" },
  { text: "Mantenimientos", icon: <Build />, path: "/mantenimientos" },
  { text: "Reservas", icon: <Event />, path: "/reservas" },
  { text: "Usuarios", icon: <Person />, path: "/usuario" },
  { text: "Encargados", icon: <AssignmentInd />, path: "/encargado" },
  { text: "Disciplinas", icon: <SportsBasketball />, path: "/disciplina" },
  { text: "Categorías", icon: <Category />, path: "/categoria" },
  { text: "Torneos", icon: <EmojiEvents />, path: "/torneos" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
          borderRadius: 1,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          component={ButtonBase}
          onClick={() => navigate("/dashboard")}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            p: 1,
            borderRadius: 1,
            gap: 0.5,
            cursor: "pointer",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo Olimpo"
            sx={{ width: 150, height: 100, objectFit: "contain" }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#d32f2f", textAlign: "center" }}
          >
            OLIMPO
          </Typography>
        </Box>

        <List sx={{ flexGrow: 1 }}>
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

        <Box
          sx={{
            p: 1,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 0.5,
              borderRadius: 1,
              bgcolor: "#f9fafb",
              "&:hover": {
                bgcolor: "#f3f4f6",
                "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                  color: "#d32f2f",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "#6b7280" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              primaryTypographyProps={{ color: "#111827", fontWeight: "bold" }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
}
