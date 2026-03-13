import theme from "@/shared/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ReduxProvider } from "./provider";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

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
        <AppRouterCacheProvider>
          <ReduxProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
