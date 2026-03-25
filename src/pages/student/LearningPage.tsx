"use client";

import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import {
  useMyCoursesQuery,
  useMyProgramsQuery,
} from "@/features/student/api/studentApi";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { routes } from "@/shared/config/routes";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { formatDateFromTimestamp } from "@/shared/lib/utils/dateTimeFormatting";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function LearningPage() {
  const router = useRouter();
  const { currentData: courses } = useMyCoursesQuery();
  const { currentData: programs } = useMyProgramsQuery();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1">Обучение</Typography>
      </HeaderBox>
      <Typography variant="h5" sx={{ px: "28px" }}>
        Мои программы
      </Typography>
      {programs && programs?.length > 0 ? (
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
          {programs.map((program) => (
            <Card sx={{ maxWidth: 270 }} key={program.id}>
              <CardActionArea
                onClick={() =>
                  router.push(routes.student.programById(program?.id))
                }
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="/coverFiller.png"
                  alt={program.title}
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
                    {program.title}
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
                    {program.description}
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    {program.deadlineAt && (
                      <Typography color="error">
                        {formatDateFromTimestamp(program.deadlineAt)}
                      </Typography>
                    )}

                    <Typography variant="h6" color="primary.main">
                      {program.completed
                        ? "100%"
                        : program.courses?.length
                          ? (
                              (program.courses?.reduce(
                                (completed, c) =>
                                  c.completed ? completed + 1 : completed,
                                0
                              ) /
                                program.courses?.length) *
                              100
                            ).toString() + "%"
                          : ""}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ) : (
        <Box m={"28px"}>Программ не назначено</Box>
      )}
      <Typography variant="h5" sx={{ px: "28px" }}>
        Мои курсы
      </Typography>
      {courses && courses?.length > 0 ? (
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
          {courses &&
            courses.map((course) => (
              <Card sx={{ maxWidth: 270 }} key={course.id}>
                <CardActionArea
                  onClick={() =>
                    router.push(routes.student.courseById(course.id))
                  }
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      course.coverFilePath
                        ? "http://217.26.31.189" + course.coverFilePath
                        : "/coverFiller.png"
                    }
                    alt={course.title}
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
                      {course.title}
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
                      {course.description}
                    </Typography>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      flexDirection={"row-reverse"}
                      alignItems={"center"}
                    >
                      {course.progress?.completionStatus === "COMPLETED" ? (
                        <DoneOutlinedIcon color="primary" fontSize="large" />
                      ) : course.progress?.completionStatus ===
                        "INCOMPLETED" ? (
                        <CloseOutlinedIcon color="error" fontSize="large" />
                      ) : (
                        <Typography variant="h6" color="primary.main">
                          {course.progress?.completionPercent || 0} %
                        </Typography>
                      )}
                      {course?.progress?.deadlineAt && (
                        <Typography color="error">
                          {formatDateFromTimestamp(
                            course?.progress?.deadlineAt
                          )}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      ) : (
        <Box m={"28px"}>Курсов не назначено</Box>
      )}
    </Box>
  );
}
