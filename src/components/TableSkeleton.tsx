import { Box, Skeleton } from "@mui/material";
export default function TableSkeleton() {
	return (
		<Box>
			{[...Array(6)].map((_, i) => (
				<Box key={i} display="grid" gridTemplateColumns="2fr 1fr 1fr 1fr 100px" gap={2} mb={1}>
					<Skeleton height={36} />
					<Skeleton height={36} />
					<Skeleton height={36} />
					<Skeleton height={36} />
					<Skeleton height={36} />
				</Box>
			))}
		</Box>
	);
}
