import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import miderecLogo from "../assets/miderec-logo.png";
import { login } from "../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { hasSession } from "../services/session";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  useEffect(() => {
    if (hasSession()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    login({ email, password })
      .then((res) => {
        if (res?.token) {
          navigate(redirectTo, { replace: true });
        }
      })
      .catch((err) => {
        setError(
          err?.message ||
            "No pudimos iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f7f8fa",
        p: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: 380,
          p: 4,
          borderRadius: 2,
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 2 }}>
          <Box component="img" src={miderecLogo} alt="MIDEREC" sx={{ width: 120, height: "auto" }} />
          <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: "bold", letterSpacing: 1 }}>
            OLIMPO
          </Typography>
        </Box>

        <Typography variant="h5" component="h1" align="center" fontWeight="bold" gutterBottom>
          Acceso administrativo
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
          Ingresa tus credenciales para continuar.
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Correo"
            type="email"
            required
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Mostrar contraseña"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <FormControlLabel control={<Checkbox size="small" disabled={loading} />} label="Recordarme" />
          </Box>

          <Button type="submit" variant="contained" color="error" fullWidth disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
