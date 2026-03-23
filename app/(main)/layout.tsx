import Sidebar from "@/widgets/Sidebar";
import Box from "@mui/material/Box";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
