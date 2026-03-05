"use client";

import { CourseDto, CourseMiniInfo } from "../model/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { Divider } from "@mui/material";

export default function CourseInfoCard({
  courseInfo,
}: {
  courseInfo: CourseMiniInfo;
}) {
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 270 }}>
      <CardActionArea
        onClick={() =>
          router.push(routes.admin.courses.courseById(courseInfo.id))
        }
      >
        <CardMedia
          component="img"
          height="140"
          image={courseInfo.coverFilePath || "/coverFiller.png"}
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
            {courseInfo.description}
          </Typography>
          <Divider sx={{ my: "16px" }} />
          <Typography variant="caption" mr={3}>
            Теория: {courseInfo.theoryLessonsCount}
          </Typography>
          <Typography variant="caption">
            Практика: {courseInfo.practiceLessonsCount}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
