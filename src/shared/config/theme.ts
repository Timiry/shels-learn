"use client";

import { createTheme, alpha } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";

const mainBlue = "#2F85C6";
const mainRed = "#B83D3D";
const mainGrey = "#bebebe";

const theme = createTheme({
  palette: {
    primary: {
      main: mainBlue,
      light: alpha(mainBlue, 0.7),
      dark: "#0e6eb7",
    },
    secondary: {
      main: mainGrey,
      light: alpha(mainGrey, 0.7),
      dark: "#6e6e6e",
      contrastText: "#111",
    },
    error: {
      main: mainRed,
      light: alpha(mainRed, 0.7),
      dark: "#a02d2d",
    },
    background: {
      default: "#EAF2F7",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 3,
        },
      },
      variants: [
        {
          props: {},
          style: ({ theme }) => ({
            [`&.${buttonClasses.outlined}`]: {
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              "&:hover": {
                borderColor: theme.palette.secondary.dark,
              },
              "&.Mui-disabled": {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
              },
            },
          }),
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
