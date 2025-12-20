import React, { useEffect, useState } from "react";
import {
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

const StatCard = ({ title, value }) => {
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			sx={{
				bgcolor: theme.palette.background.paper,
				p: 1.5,
				borderRadius: 1.5,
				display: "flex",
				flexDirection: "column",
				gap: 0.6,
				height: "100%",
			}}
		>
			<Typography variant="caption" sx={{ color: theme.palette.common.primary }}>
				{title}
			</Typography>
			<Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.common.secondary }}>
				{value}
			</Typography>
		</Paper>
	);
};

const DashboardPage = () => {
	const [data, setData] = useState({
		stats: [],
		activity: [],
		classification: [],
		events: [],
		currentUserName: "",
	});
	const [loading, setLoading] = useState(true);
	const theme = useTheme();

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		getDashboardData()
			.then((payload) => {
				if (isMounted) setData(payload);
			})
			.catch((error) =>
				console.error("Error loading dashboard data", error)
			)
			.finally(() => {
				if (isMounted) setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const { stats, activity, classification, events, currentUserName } = data;
	const activityColors = [
		theme.palette.primary.main,
		theme.palette.primary.light,
		theme.palette.primary.dark,
	];
	const activityData = activity.map((item, index) => ({
		...item,
		color: activityColors[index % activityColors.length],
	}));

	const classificationData = classification.map((item) => {
		let color = theme.palette.grey[300];

		switch (item.name) {
			case "Activo":
				color = theme.palette.success.main;
				break;
			case "Inactivo":
				color = theme.palette.grey[400];
				break;
			case "En Mantenimiento":
				color = theme.palette.warning.main;
				break;
			case "Reservado":
				color = theme.palette.primary.light;
				break;
			default:
				break;
		}

		return {
			...item,
			color,
		};
	});

	if (loading) {
		return (
			<Box
				sx={{
					flexGrow: 1,
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				aria-busy
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				flexGrow: 1,
				p: { xs: 2, md: 4 },
				minHeight: "100vh",
			}}
		>
			<Box sx={{ mb: 3 }}>
				<Typography
					variant="h4"
					sx={{ fontWeight: 800, color: theme.palette.common.black }}
				>
					Dashboard
				</Typography>
				<Typography
					variant="subtitle2"
					sx={{ mt: 0.5, color: theme.palette.primary.main }}
				>
					Bienvenido, {currentUserName || "al panel principal"}
				</Typography>
			</Box>

			{/* CARDS */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, 1fr)",
						md: "repeat(4, 1fr)",
					},
					gap: 2,
					mb: 3,
				}}
			>
				{stats.map((item) => (
					<StatCard key={item.title} {...item} />
				))}
			</Box>

			{/* ACTIVIDAD + CLASIFICACIÓN */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						lg: "1.6fr 1fr",
					},
					gap: 2,
					mb: 3,
				}}
			>
				{/* ACTIVIDAD */}
				<Paper
					elevation={0}
					sx={{
						bgcolor: theme.palette.background.paper,
						p: 3,
						borderRadius: 3,
					}}
				>
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 800, mb: 2, color: theme.palette.text.primary }}
					>
						Actividad del sistema
					</Typography>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(3, 1fr)",
							},
							gap: 3,
						}}
					>
						{activityData.map((item) => (
							<Box
								key={item.name}
								sx={{
									position: "relative",
									height: 220,
								}}
							>
								<ResponsiveContainer>
									<RadialBarChart
										innerRadius="70%"
										outerRadius="100%"
										data={[
											{
												name: item.name,
												value: item.value,
												fill: item.color,
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
											dataKey="value"
											background={{ fill: theme.palette.grey[200] }}
											cornerRadius={12}
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
									<Typography
										variant="h4"
										sx={{ fontWeight: 800, color: theme.palette.text.primary }}
									>
										{item.value}%
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: theme.palette.text.secondary }}
									>
										{item.name}
									</Typography>
								</Box>
							</Box>
						))}
					</Box>
				</Paper>

				{/* CLASIFICACIÓN */}
				<Paper
					elevation={0}
					sx={{
						bgcolor: theme.palette.background.paper,
						p: 3,
						borderRadius: 3,
					}}
				>
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 800, color: theme.palette.text.primary }}
					>
						Clasificación de instalaciones por estado
					</Typography>

					<Box sx={{ height: 260 }}>
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={classificationData}
									dataKey="value"
									cx="50%"
									cy="50%"
									innerRadius={46}
									outerRadius={82}
									paddingAngle={4}
								>
									{classificationData.map((entry) => (
										<Cell
											key={entry.name}
											fill={entry.color}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</Box>

					<Box sx={{ mt: 2 }}>
						{classificationData.map((item) => (
							<Typography
								key={item.name}
								variant="body2"
								component="div"
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									color: theme.palette.text.secondary,
								}}
							>
								<LegendDot color={item.color} />
								{item.name} — <strong>{item.value}</strong>
							</Typography>
						))}
					</Box>
				</Paper>
			</Box>

			{/* EVENTOS */}
			<Paper
				elevation={0}
				sx={{
					bgcolor: theme.palette.background.paper,
					p: 3,
					borderRadius: 3,
				}}
			>
				<Typography
					variant="subtitle1"
					sx={{ fontWeight: 800, mb: 2, color: theme.palette.text.primary }}
				>
					Próximos eventos y torneos
				</Typography>

				<TableContainer>
					<Table size="small">
						<TableHead
							sx={{
								backgroundColor: theme.palette.grey[100],
							}}
						>
							<TableRow>
								<TableCell
									sx={{
										color: theme.palette.common.black,
										fontWeight: 700,
									}}
								>
									Evento
								</TableCell>

								<TableCell
									sx={{
										color: theme.palette.common.black,
										fontWeight: 700,
									}}
								>
									Participación
								</TableCell>

								<TableCell
									sx={{
										color: theme.palette.common.black,
										fontWeight: 700,
									}}
								>
									Inscritos
								</TableCell>

								<TableCell
									sx={{
										color: theme.palette.common.black,
										fontWeight: 700,
									}}
								>
									Fecha
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{events.map((e) => (
								<TableRow key={`${e.evento}-${e.fecha}`}>
									<TableCell sx={{ color: theme.palette.common.black }}>
										{e.evento}
									</TableCell>
									<TableCell sx={{ color: theme.palette.common.black }}>
										{e.participacion}
									</TableCell>
									<TableCell sx={{ color: theme.palette.common.black }}>
										{e.inscritos}
									</TableCell>
									<TableCell sx={{ color: theme.palette.common.black }}>
										{e.fecha}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
};

export default DashboardPage;
