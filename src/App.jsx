import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import InstalacionesPage from "./pages/InstalacionesPage";
import UsuariosPage from "./pages/UsuariosPage";
import ReservasPage from "./pages/ReservasPage";
import TorneosPage from "./pages/TorneosPage";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        {/* Sidebar permanente */}
        <Sidebar />

        {/* Contenedor de páginas */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/instalaciones" element={<InstalacionesPage />} />
            <Route path="/usuario" element={<UsuariosPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/torneos" element={<TorneosPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
