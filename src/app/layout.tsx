import theme from "@/shared/config/theme";
import { store } from "@/shared/redux/store";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Provider } from "react-redux";
import { ReduxProvider } from "./provider";

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
        <ReduxProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>{children}</main>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
