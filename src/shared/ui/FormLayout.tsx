"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import type { PropsWithChildren } from "react";

const FormLayout = (props: PropsWithChildren & BoxProps) => {
  return (
    <Box
      width="500px"
      m="40px auto"
      position="relative"
      sx={{ bgcolor: "background.default" }}
    >
      <Paper
        elevation={6}
        sx={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          p: 6,
          borderRadius: 2,
        }}
      >
        <Box p="16px" {...props} />
      </Paper>
    </Box>
  );
};

export default FormLayout;
