import { createTheme } from "@mui/material/styles";

const draculaPalette = {
  background: {
    default: "#21222c",
    paper: "#44475a",
  },
  text: {
    primary: "#f8f8f2",
    secondary: "#bd93f9",
  },
  primary: {
    main: "#6272a4",
  },
  secondary: {
    main: "#50fa7b",
  },
};

const theme = createTheme({
  palette: {
    mode: "dark",
    ...draculaPalette,
  },
});

export default theme;
