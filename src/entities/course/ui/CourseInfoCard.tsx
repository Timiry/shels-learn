"use client";

import { CourseDto } from "../model/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

export default function CourseInfoCard({
  courseInfo,
}: {
  courseInfo: CourseDto;
}) {
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 270 }}>
      <CardActionArea
        onClick={() =>
          router.push(routes.admin.courses.courseById(courseInfo.courseId))
        }
      >
        <CardMedia
          component="img"
          height="140"
          image={courseInfo.coverUrl}
          alt={courseInfo.title}
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
            {courseInfo.title}
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
            {courseInfo.discription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
