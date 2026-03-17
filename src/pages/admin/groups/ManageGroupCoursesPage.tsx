"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  //TODO: добавить получение инфы, списков in notIn, метод редактирования назнчения
  //моки:
  const groupInfo = { id: groupId, title: "Тестовая группа", type: "GENERAL" };
  const coursesLists = {
    in: [
      {
        id: 1,
        title: "Курс",
      },
      {
        id: 2,
        title: "Курс",
      },
      {
        id: 3,
        title: "Курс",
      },
      {
        id: 4,
        title: "Курс",
      },
      {
        id: 5,
        title: "Курс",
      },
    ],
    notIn: [],
  };

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление курсами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={coursesLists?.in || []}
        notIn={coursesLists?.notIn || []}
        onSubmit={() => {
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "courses"
            )
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "courses"
            )
          )
        }
      />
    </Box>
  );
}
