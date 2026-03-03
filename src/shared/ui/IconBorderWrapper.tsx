import Box from "@mui/material/Box";
import { PropsWithChildren } from "react";

export default function IconBorderWrapper(props: PropsWithChildren) {
  return (
    <Box
      {...props}
      sx={{
        border: "1px solid",
        borderRadius: "50%",
        width: "45px",
        height: "45px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></Box>
  );
}
