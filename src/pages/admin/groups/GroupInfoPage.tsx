"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import TabNavigation from "@/shared/ui/TabNavigation";
import {
  CreateGroupRequest,
  GroupDto,
  GroupType,
  LearningProgramDto,
} from "@/features/groupsManagement/api/groupsApi";
import groupTypeToWord from "@/features/groupsManagement/lib/groupTypeToWord";
import GroupStudentsTable from "@/features/groupsManagement/ui/GroupStudentsTable";
import { UserDto } from "@/entities/user/model/usersApi";
import GroupCoursesTable from "@/features/groupsManagement/ui/GroupCoursesTable";
import { CourseMiniInfo } from "@/entities/course/model/types";
import GroupProgramsTable from "@/features/groupsManagement/ui/GroupProgramsTable";
import { useState } from "react";
import GroupModalForm from "@/features/groupsManagement/ui/GroupModalForm";

export default function GroupInfoPage() {
  const router = useRouter();
  const params = useParams();
  const groupType = params?.type as GroupType;
  const groupId = params?.id as string;

  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "students";

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // const { currentData: groupInfo } = useGetGroupQuery(+groupId); // предполагаем получение группы
  // методы получения студентов, курсов, программ

  // моки:
  const groupInfo: GroupDto = {
    id: groupId,
    title: "Тестовая группа",
    type: "GENERAL",
  };
  const students: UserDto[] = [
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
  ];

  const courses: CourseMiniInfo[] = [
    {
      id: 1,
      title: "Тестовый курс1",
      theoryLessonsCount: 5,
      practiceLessonsCount: 0,
    },
    {
      id: 2,
      title: "Тестовый курс2",
      theoryLessonsCount: 5,
      practiceLessonsCount: 10,
    },
    {
      id: 3,
      title: "Тестовый курс3",
      theoryLessonsCount: 10,
      practiceLessonsCount: 10,
    },
  ];

  const programs: LearningProgramDto[] = [
    {
      id: 1,
      title: "Тестовая программа1",
      courses: [1],
    },
    {
      id: 2,
      title: "Тестовая программа1",
      courses: [2, 3, 5],
    },
    {
      id: 3,
      title: "Тестовая программа1",
      courses: [4, 7],
    },
  ];

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Группы{" > "}
            {groupTypeToWord[groupType]}
          </Typography>
          <Typography variant="h1">{groupInfo?.title}</Typography>
        </Box>
        <Tooltip arrow title={"Редактировать группу"}>
          <IconButton
            onClick={() => {
              setIsGroupModalOpen(true);
            }}
          >
            <EditOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>
      <TabNavigation
        tabs={[
          { id: "students", label: "СТУДЕНТЫ" },
          { id: "courses", label: "Курсы" },
          { id: "programs", label: "Программы" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId: string) =>
          router.push(
            routes.admin.groups.groupInfoByIdAndTab(
              groupInfo.type,
              groupInfo.id,
              tabId
            )
          )
        }
      >
        {activeTab === "students" && (
          <Box px={"28px"}>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() => {
                  //   router.push(routes.admin.groups.manageStudents(groupInfo.type, groupId)) //TODO: добавить страницу управления студентами
                }}
              >
                Управление студентами
              </Button>
            </Box>
            <GroupStudentsTable students={students} />
          </Box>
        )}

        {activeTab === "courses" && (
          <Box px={"28px"}>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() => {
                  //   router.push(routes.admin.groups.manageCourses(groupInfo.type, groupId)) //TODO: добавить страницу управления курсами
                }}
              >
                Управление курсами
              </Button>
            </Box>
            <GroupCoursesTable courses={courses} />
          </Box>
        )}

        {activeTab === "programs" && (
          <Box px={"28px"}>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() => {
                  //   router.push(routes.admin.groups.managePrograms(groupInfo.type, groupId)) //TODO: добавить страницу управления программами
                }}
              >
                Управление программами
              </Button>
            </Box>
            <GroupProgramsTable programs={programs} />
          </Box>
        )}
      </TabNavigation>
      <GroupModalForm
        open={isGroupModalOpen}
        onSubmit={(groupInfo: CreateGroupRequest) => {
          console.log("Изменение группы", groupInfo);
          //TODO: добавить метод редактирования группы
          setIsGroupModalOpen(false);
        }}
        onDelete={(groupId: string) => {
          console.log("Удаление группы", groupId);
          //TODO: добавить метод удаления группы
          setIsGroupModalOpen(false);
          router.push(routes.admin.groups.allGroupsByType(groupType));
        }}
        onClose={() => {
          setIsGroupModalOpen(false);
        }}
        isCreation={false}
        currentValues={groupInfo}
      />
    </Box>
  );
}
