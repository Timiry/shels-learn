"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { Divider } from "@mui/material";
import { ProgramDto } from "../model/programsApi";

export default function ProgramInfoCard({
  programInfo,
}: {
  programInfo: ProgramDto;
}) {
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 270 }}>
      <CardActionArea
        onClick={() =>
          router.push(
            routes.admin.programs.programInfoByIdAndTab(
              programInfo.id,
              "description"
            )
          )
        }
      >
        <CardMedia
          component="img"
          height="140"
          image="/coverFiller.png"
          alt={programInfo.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {programInfo.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {programInfo.description}
          </Typography>
          <Divider sx={{ my: "16px" }} />
          <Typography variant="caption" mr={3}>
            Курсы: {programInfo.courses?.length || 0}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
