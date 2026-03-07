import Sidebar from "@/widgets/Sidebar";
import Box from "@mui/material/Box";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box width="100%" height="calc(100vh)" bgcolor="#EAF2F7" pt="40px">
      {children}
    </Box>
  );
}
