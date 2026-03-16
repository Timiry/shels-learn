"use client";

import {
  GroupSummaryDto,
  GroupType,
} from "@/features/groupsManagement/api/groupsApi";
import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useParams, useRouter } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import TabNavigation from "@/shared/ui/TabNavigation";
import { routes } from "@/shared/config/routes";
import groupTypeToWord from "@/features/groupsManagement/lib/groupTypeToWord";
import GroupTable from "@/features/groupsManagement/ui/GroupTable";

export default function GroupsPage() {
  const router = useRouter();
  const params = useParams();
  const groupType = params?.type as GroupType;

  // мок получения всех групп
  const allGroups: GroupSummaryDto[] = [
    {
      id: 1,
      title: "Группа А-101",
      type: "GENERAL",
      studentsCount: 25,
      coursesCount: 3,
      programsCount: 1,
    },
    {
      id: 2,
      title: 'ООО "ТехноСофт"',
      type: "COMPANY",
      studentsCount: 150,
      coursesCount: 8,
      programsCount: 2,
    },
    {
      id: 3,
      title: "Отдел разработки",
      type: "DEPARTMENT",
      studentsCount: 45,
      coursesCount: 5,
      programsCount: 1,
    },
    {
      id: 4,
      title: "Менеджеры проектов",
      type: "POSITION",
      studentsCount: 18,
      coursesCount: 4,
      programsCount: 1,
    },
    {
      id: 5,
      title: "Группа Б-205",
      type: "GENERAL",
      studentsCount: 22,
      coursesCount: 3,
      programsCount: 1,
    },
    {
      id: 6,
      title: 'ЗАО "Диджитал Эдьюкейшн"',
      type: "COMPANY",
      studentsCount: 200,
      coursesCount: 12,
      programsCount: 3,
    },
    {
      id: 7,
      title: "Отдел маркетинга",
      type: "DEPARTMENT",
      studentsCount: 30,
      coursesCount: 4,
      programsCount: 1,
    },
    {
      id: 8,
      title: "Frontend разработчики",
      type: "POSITION",
      studentsCount: 28,
      coursesCount: 6,
      programsCount: 2,
    },
    {
      id: 9,
      title: "Группа В-303",
      type: "GENERAL",
      studentsCount: 20,
      coursesCount: 2,
      programsCount: 1,
    },
    {
      id: 10,
      title: 'ООО "Бизнес Тренинг"',
      type: "COMPANY",
      studentsCount: 120,
      coursesCount: 7,
      programsCount: 2,
    },
  ];
  const groupsByType: GroupSummaryDto[] = allGroups.filter(
    (item) => item.type === groupType
  );

  return (
    <Box>
      <TabNavigation
        tabs={[
          { id: "GENERAL", label: "Общие" },
          { id: "COMPANY", label: "Компании" },
          { id: "DEPARTMENT", label: "Подразделения" },
          { id: "POSITION", label: "Должности" },
        ]}
        activeTab={groupType}
        onTabChange={(tabId: string) =>
          router.push(routes.admin.groups.allGroupsByType(tabId))
        }
      >
        <HeaderBox>
          <Box>
            <Typography variant="h1">{groupTypeToWord[groupType]}</Typography>
          </Box>
          <Tooltip arrow title={"Создать группу"}>
            <IconButton
              onClick={() => {}} //TODO: открытие модалки для создания группы текущего типа
            >
              <AddOutlinedIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </HeaderBox>

        <Box px={"28px"}>
          <GroupTable groups={groupsByType} />
        </Box>
      </TabNavigation>
    </Box>
  );
}
