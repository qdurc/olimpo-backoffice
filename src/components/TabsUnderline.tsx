import * as React from "react";
import { Box, Tab, Tabs } from "@mui/material";

export default function TabsUnderline({
	value, onChange, items,
}: { value: number; onChange: (n: number) => void; items: string[] }) {
	return (
		<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
			<Tabs value={value} onChange={(_, v) => onChange(v)} TabIndicatorProps={{ sx: { height: 3, borderRadius: 3 } }}>
				{items.map((t, i) => (
					<Tab
						key={t}
						label={t}
						sx={{
							textTransform: "none",
							fontWeight: 600,
							mr: 1,
							minHeight: 42,
						}}
						value={i}
					/>
				))}
			</Tabs>
		</Box>
	);
}
