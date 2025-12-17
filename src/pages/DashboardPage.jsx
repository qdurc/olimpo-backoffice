import React, { useEffect, useState } from "react";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
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

const cardBorder = "1px solid #e5e7eb";
const neutralText = "#4b5563";

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

const StatCard = ({ title, value }) => (
	<Paper
		elevation={0}
		sx={{
			border: cardBorder,
			bgcolor: "#FFFFFF",
			p: 1.5,
			borderRadius: 1.5,
			display: "flex",
			flexDirection: "column",
			gap: 0.6,
			height: "100%",
		}}
	>
		<Typography variant="caption" sx={{ color: neutralText }}>
			{title}
		</Typography>
		<Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
			{value}
		</Typography>
	</Paper>
);

const DashboardPage = () => {
	const [data, setData] = useState({
		stats: [],
		activity: [],
		classification: [],
		events: [],
	});
	const [loading, setLoading] = useState(true);

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

	const { stats, activity, classification, events } = data;

	return (
		<Box
			sx={{
				flexGrow: 1,
				p: { xs: 2, md: 4 },
				minHeight: "100vh",
			}}
		>
			<Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
				Dashboard
			</Typography>

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
				{stats.map((item, i) => (
					<StatCard key={i} {...item} />
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
						border: cardBorder,
						bgcolor: "#FFFFFF",
						p: 3,
						borderRadius: 3,
					}}
				>
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 800, mb: 2 }}
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
						{activity.map((item, index) => (
							<Box
								key={index}
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
											background={{ fill: "#E5E7EB" }}
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
										sx={{ fontWeight: 800 }}
									>
										{item.value}%
									</Typography>
									<Typography
										variant="caption"
										sx={{ color: neutralText }}
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
						border: cardBorder,
						bgcolor: "#FFFFFF",
						p: 3,
						borderRadius: 3,
					}}
				>
					<Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
						Clasificación
					</Typography>

					<Box sx={{ height: 260 }}>
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={classification}
									dataKey="value"
									cx="50%"
									cy="50%"
									innerRadius={46}
									outerRadius={82}
									paddingAngle={4}
								>
									{classification.map((entry, index) => (
										<Cell
											key={index}
											fill={entry.color}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</Box>

					<Box sx={{ mt: 2 }}>
						{classification.map((item, index) => (
							<Typography
								key={index}
								variant="body2"
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									color: neutralText,
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
					border: cardBorder,
					bgcolor: "#FFFFFF",
					p: 3,
					borderRadius: 3,
				}}
			>
				<Typography
					variant="subtitle1"
					sx={{ fontWeight: 800, mb: 2 }}
				>
					Próximos eventos y torneos
				</Typography>

				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Evento</TableCell>
								<TableCell>Participación</TableCell>
								<TableCell>Inscritos</TableCell>
								<TableCell>Fecha</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{events.map((e, i) => (
								<TableRow key={i}>
									<TableCell>{e.evento}</TableCell>
									<TableCell>{e.participacion}</TableCell>
									<TableCell>{e.inscritos}</TableCell>
									<TableCell>{e.fecha}</TableCell>
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
