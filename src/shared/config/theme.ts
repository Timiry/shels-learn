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
      light: alpha(mainBlue, 0.1),
      dark: "#0e6eb7",
    },
    secondary: {
      main: mainGrey,
      light: alpha(mainGrey, 0.7),
      dark: "#6e6e6e",
      contrastText: "#111",
    },
    success: {
      main: "#EFF7DE",
      dark: "#5ca448",
    },
    error: {
      main: mainRed,
      light: alpha(mainRed, 0.7),
      dark: "#a02d2d",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    htmlFontSize: 14,
    fontSize: 14,
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: "1.35rem",
      fontWeight: 300,
      textTransform: "uppercase",
    },
    subtitle2: {
      fontSize: "0.85rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    caption: { fontSize: "0.85rem" },
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
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#111",
        },
      },
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
