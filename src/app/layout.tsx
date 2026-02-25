import theme from "@/shared/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ReduxProvider } from "./provider";
import Sidebar from "@/widgets/Sidebar";
import Box from "@mui/material/Box";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Shels learn",
  description: "Корпоративная платформа для обучения сотрудников фирмы Shels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" style={{ fontSize: "14px" }}>
      <body className={`${montserrat.className}`}>
        <ReduxProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex" }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
