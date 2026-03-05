import Box from "@mui/material/Box";
import { PropsWithChildren } from "react";

export default function HeaderBox(props: PropsWithChildren) {
  return (
    <Box
      p={"21px 28px"}
      display={"flex"}
      justifyContent={"space-between"}
      width={"100%"}
      {...props}
    ></Box>
  );
}
