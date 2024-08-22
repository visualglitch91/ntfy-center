import { Box } from "@mui/material";
import StaticBadge from "./StaticBadge";

export default function LabelWithCount({
  label,
  count,
}: {
  label: React.ReactNode;
  count: number;
}) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {label}
      <StaticBadge count={count} />
    </Box>
  );
}
