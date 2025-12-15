import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import { hasSession } from "./services/session";

function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = hasSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: showSidebar ? "#F5F5F5" : "#fff",
        minHeight: "100vh",
      }}
    >
      {showSidebar && <Sidebar />}

      <Box component="main" sx={{ flexGrow: 1, p: showSidebar ? 3 : 0 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
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
          </Route>
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
