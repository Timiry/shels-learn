"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useMyProgramQuery } from "@/features/student/api/studentApi";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { formatDateFromTimestamp } from "@/shared/lib/utils/dateTimeFormatting";

export default function MyProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id as string;
  const { currentData: program } = useMyProgramQuery(+programId);

  return (
    <Box width={"80%"} mx={"auto"}>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Программы{" > "}
            {program?.title}
          </Typography>
          <Typography variant="h1">{program?.title}</Typography>
        </Box>
      </HeaderBox>

      <Box mx={"28px"}>
        <Box my={2}>
          {program?.courses?.length && (
            <Typography variant="subtitle2">
              Пройдено курсов:{" "}
              {program.completed
                ? program.courses.length
                : program.courses?.reduce(
                    (completed, c) => (c.completed ? completed + 1 : completed),
                    0
                  )}{" "}
              из {program.courses.length}
            </Typography>
          )}
          {program?.deadlineAt && (
            <Typography variant="subtitle2">
              Дедлайн: {formatDateFromTimestamp(program?.deadlineAt)}
            </Typography>
          )}
        </Box>
        <Typography display={"block"} variant="body2" pb={2}>
          {program?.description}
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            py: 3,
          }}
        >
          {program?.courses &&
            program.courses?.map((course, index) => (
              <Card sx={{ maxWidth: 270 }} key={course?.courseId}>
                <CardActionArea
                  onClick={() =>
                    router.push(routes.student.courseById(course.courseId))
                  }
                  disabled={!course.available}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      course?.coverFilePath
                        ? "http://217.26.31.189" + course.coverFilePath
                        : "/coverFiller.png"
                    }
                    alt={course?.title}
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
                      {course?.title}
                    </Typography>

                    <Divider sx={{ my: "16px" }} />
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography variant="h5" color="secondary">
                        {index + 1}
                      </Typography>
                      {course.completed && (
                        <DoneOutlinedIcon color="primary" fontSize="large" />
                      )}
                      {course.available === false && (
                        <LockOutlinedIcon fontSize="large" />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
