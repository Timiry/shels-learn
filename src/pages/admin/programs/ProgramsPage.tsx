"use client";

import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import ProgramInfoCard from "@/features/programs/ui/ProgramInfoCard";
import { useGetProgramsQuery } from "@/features/programs/model/programsApi";

export default function ProgramsPage() {
  const router = useRouter();
  const { currentData: programs } = useGetProgramsQuery();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Программы
        </Typography>
        <Tooltip arrow title={"Создать программу"}>
          <IconButton
            onClick={() => {
              router.push(routes.admin.programs.createProgram);
            }}
          >
            <BookmarkAddOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
          p: 2,
        }}
      >
        {programs &&
          programs.map((program) => (
            <ProgramInfoCard programInfo={program} key={program.id} />
          ))}
      </Box>
    </Box>
  );
}
