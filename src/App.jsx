import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import MaintenancePage from "./pages/MaintenancePage";
import UsersPage from "./pages/UsersPage";
import ReservationsPage from "./pages/ReservationsPage";
import TournamentsPage from "./pages/TournamentsPage";
import ManagersPage from "./pages/ManagersPage";
import DisciplinesPage from "./pages/DisciplinesPage";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
        {/* Sidebar permanente */}
        <Sidebar />

        {/* Contenedor de páginas */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/instalaciones" element={<FacilitiesPage />} />
            <Route path="/mantenimientos" element={<MaintenancePage />} />
            <Route path="/usuario" element={<UsersPage />} />
            <Route path="/encargado" element={<ManagersPage />} />
            <Route path="/disciplina" element={<DisciplinesPage />} />
            <Route path="/categoria" element={<CategoriesPage />} />
            <Route path="/reservas" element={<ReservationsPage />} />
            <Route path="/torneos" element={<TournamentsPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
