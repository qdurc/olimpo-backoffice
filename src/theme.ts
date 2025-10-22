import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1E88E5",
			light: "#64B5F6",
			dark: "#1565C0",
		},
		secondary: { main: "#7C4DFF" },
		success: { main: "#2E7D32" },
		warning: { main: "#ED6C02" },
		error: { main: "#D32F2F" },
		grey: { 100: "#F7F8FA", 200: "#EEF1F4", 300: "#E3E8EF", 400: "#C6CDD5", 500: "#94A3B8" },
		background: { default: "#F6F7F9", paper: "#FFFFFF" },
		text: { primary: "#0F172A", secondary: "#475569" },
		divider: "#E5E7EB",
	},
	shape: { borderRadius: 12 },
	typography: {
		fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`,
		h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
		h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.25 },
		h3: { fontSize: 20, fontWeight: 600 },
		subtitle1: { fontSize: 14, color: "#64748B" },
		body1: { fontSize: 14, lineHeight: 1.6 },
		button: { textTransform: "none", fontWeight: 600 },
	},
	components: {
		MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
		MuiCard: { styleOverrides: { root: { boxShadow: "0 6px 28px rgba(2,8,20,.06)" } } },
		MuiTabs: { styleOverrides: { indicator: { borderRadius: 3 } } },
		MuiButton: {
			styleOverrides: {
				root: { borderRadius: 10, paddingInline: 16, height: 40 },
				contained: { boxShadow: "0 4px 14px rgba(30,136,229,0.2)" },
			},
		},
		MuiTextField: {
			defaultProps: { size: "small" },
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					background: "#fff",
					"& fieldset": { borderColor: "#E5E7EB" },
					"&:hover fieldset": { borderColor: "#CBD5E1" },
					"&.Mui-focused fieldset": { borderColor: "#1E88E5" },
				},
			},
		},
		MuiTableCell: {
			styleOverrides: { root: { paddingTop: 12, paddingBottom: 12 } },
		},
	},
});
