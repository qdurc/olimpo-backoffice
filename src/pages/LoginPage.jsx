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
  Alert,
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
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  useEffect(() => {
    if (hasSession()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const normalizeErrorMessage = (err) => {
    const fallback =
      "No pudimos iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.";

    const resolveKnownMessage = (text) => {
      const lower = text.toLowerCase();
      if (lower.includes("invalid_login_credentials")) {
        return "Credenciales inválidas. Verifica tu correo y contraseña.";
      }
      if (lower.includes("user is not an admin")) {
        return "Tu usuario no tiene permisos de administrador.";
      }
      if (lower.includes("status 401") || lower.includes("unauthorized") || lower.includes("no autorizado")) {
        return "Credenciales inválidas. Verifica tu correo y contraseña.";
      }
      if (lower.includes("status 500")) {
        return "El servidor tuvo un problema. Intenta nuevamente más tarde.";
      }
      if (text.includes("Failed to fetch") || text.includes("NetworkError")) {
        return "No pudimos conectar con el servidor. Intenta nuevamente más tarde.";
      }
      return "";
    };

    if (!(err instanceof Error)) return fallback;

    const raw = err.message?.trim?.() ?? "";
    if (!raw) return fallback;

    const known = resolveKnownMessage(raw);
    if (known) return known;

    if ((raw.startsWith("{") && raw.endsWith("}")) || (raw.startsWith("[") && raw.endsWith("]"))) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.errors)) {
          const joined = parsed.errors.join(" ");
          const knownFromErrors = resolveKnownMessage(joined);
          if (knownFromErrors) return knownFromErrors;
        }
        if (parsed?.message) {
          const knownFromMessage = resolveKnownMessage(String(parsed.message));
          return knownFromMessage || String(parsed.message);
        }
      } catch {
        // ignore JSON parse errors
      }
    }

    return raw;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({ email: "", password: "" });

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "" };

    if (!trimmedEmail) {
      nextErrors.email = "Correo requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Correo inválido";
    }

    if (!trimmedPassword) {
      nextErrors.password = "Contraseña requerida";
    } else if (trimmedPassword.length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);

    login({ email: trimmedEmail, password: trimmedPassword })
      .then((res) => {
        if (res?.token) {
          navigate(redirectTo, { replace: true });
          return;
        }
        setError("No pudimos iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.");
      })
      .catch((err) => {
        setError(normalizeErrorMessage(err));
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Correo"
            type="email"
            required
            fullWidth
            size="small"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }
              if (error) setError("");
            }}
            disabled={loading}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />

          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            size="small"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }
              if (error) setError("");
            }}
            disabled={loading}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            inputProps={{ minLength: 6 }}
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
