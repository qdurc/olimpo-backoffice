import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#00205B",
			light: "#3366CC",
			dark: "#00205B",
		},
		secondary: { main: "#3366CC" },
		success: { main: "#00205B" },
		warning: { main: "#ED1C24" },
		error: { main: "#ED1C24" },
		grey: { 100: "#F5F5F5", 200: "#F5F5F5", 300: "#C0C0C0", 400: "#C0C0C0", 500: "#C0C0C0" },
		background: { default: "#F5F5F5", paper: "#FFFFFF" },
		text: { primary: "#00205B", secondary: "#3366CC" },
		divider: "#C0C0C0",
	},
	shape: { borderRadius: 12 },
	typography: {
		fontFamily: `"Poppins", system-ui, -apple-system, Segoe UI, Roboto, sans-serif`,
		h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
		h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.25 },
		h3: { fontSize: 20, fontWeight: 600 },
		subtitle1: { fontSize: 14, color: "#00205B" },
		body1: { fontSize: 14, lineHeight: 1.6 },
		button: { textTransform: "none", fontWeight: 600 },
	},
	components: {
		MuiPaper: { styleOverrides: { root: { borderRadius: 16 } } },
		MuiCard: { styleOverrides: { root: { boxShadow: "0 6px 28px rgba(0,32,91,0.06)" } } },
		MuiTabs: { styleOverrides: { indicator: { borderRadius: 3 } } },
		MuiButton: {
			styleOverrides: {
				root: { borderRadius: 10, paddingInline: 16, height: 40 },
				contained: { boxShadow: "0 4px 14px rgba(0,32,91,0.2)" },
			},
		},
		MuiTextField: {
			defaultProps: { size: "small" },
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					background: "#FFFFFF",
					"& fieldset": { borderColor: "#C0C0C0" },
					"&:hover fieldset": { borderColor: "#3366CC" },
					"&.Mui-focused fieldset": { borderColor: "#00205B" },
				},
			},
		},
		MuiTableCell: {
			styleOverrides: { root: { paddingTop: 12, paddingBottom: 12 } },
		},
	},
});
