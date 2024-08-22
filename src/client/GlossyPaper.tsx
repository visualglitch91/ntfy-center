import { Box, styled } from "@mui/material";

const GlossyPaper = styled(Box)(({ theme }) => ({
  "&, &.MuiPaper-root": {
    backgroundColor: "rgba(0,0,0,0.4)",
    backgroundImage: "none",
    backdropFilter: "blur(15px)",
    borderRadius: 16,
    boxShadow: theme.shadows[2],
  },
}));

export default GlossyPaper;
