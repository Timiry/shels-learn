"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  //TODO: добавить получение инфы, списков in notIn, метод редактирования назнчения
  //моки:
  const groupInfo = { id: groupId, title: "Тестовая группа", type: "GENERAL" };
  const studentsLists = {
    in: [
      {
        id: 1,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 2,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 3,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 4,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 5,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 6,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 7,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 8,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 9,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 10,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 12,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 13,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 14,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 15,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
      {
        id: 16,
        fullName: "Иван Иванович",
        email: "ivan@mail.ru",
        role: "STUDENT",
      },
    ],
    notIn: [],
  };

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление студентами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={studentsLists?.in || []}
        notIn={studentsLists?.notIn || []}
        onSubmit={() => {
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "students"
            )
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "students"
            )
          )
        }
      />
    </Box>
  );
}
