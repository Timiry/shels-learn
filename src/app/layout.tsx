import theme from "@/shared/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

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
    <html lang="ru">
      <body className={`${montserrat.className}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
