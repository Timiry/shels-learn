import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiCollapse from "@mui/material/Collapse";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function Collapse({
  title,
  children,
  defaultExpanded = false,
}: CollapseProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: "background.default",
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6">{title}</Typography>
        <ExpandMoreIcon
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </Box>

      <MuiCollapse in={expanded}>
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          {children}
        </Box>
      </MuiCollapse>
    </Box>
  );
}
