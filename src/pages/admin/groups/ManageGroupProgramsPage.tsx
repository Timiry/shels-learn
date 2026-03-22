"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupProgramsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  //TODO: добавить получение инфы, списков in notIn, метод редактирования назнчения
  //моки:
  const groupInfo = { id: groupId, title: "Тестовая группа", type: "GENERAL" };
  const programsLists = {
    in: [
      {
        id: 1,
        title: "Программа",
      },
      {
        id: 2,
        title: "Программа",
      },
      {
        id: 3,
        title: "Программа",
      },
      {
        id: 4,
        title: "Программа",
      },
      {
        id: 5,
        title: "Программа",
      },
    ],
    notIn: [],
  };

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление программами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={programsLists?.in || []}
        notIn={programsLists?.notIn || []}
        onSubmit={() => {
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "programs"
            )
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupId,
              "programs"
            )
          )
        }
      />
    </Box>
  );
}
