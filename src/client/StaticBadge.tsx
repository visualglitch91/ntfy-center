import { Badge, SxProps } from "@mui/material";

export default function StaticBadge({
  count,
  sx,
}: {
  count: number;
  sx?: SxProps;
}) {
  return (
    <Badge
      badgeContent={count}
      color="error"
      //@ts-expect-error
      sx={new Array<SxProps>()
        .concat({
          "& .MuiBadge-badge": {
            position: "static",
            transform: "none",
            transition: "none",
          },
        })
        .concat(sx || [])}
    />
  );
}
