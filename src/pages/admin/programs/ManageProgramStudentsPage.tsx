"use client";

import {
  useGetProgramQuery,
  useGetProgramEnrollmentListsQuery,
  useAssignUsersToProgramMutation,
} from "@/features/programs/model/programsApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageProgramStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id as string;

  const { currentData: programInfo } = useGetProgramQuery(+programId);
  const { currentData: studentsLists } =
    useGetProgramEnrollmentListsQuery(+programId);
  const [asignStudents] = useAssignUsersToProgramMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление студентами</Typography>
          <Typography variant="body2" color="secondary">
            {programInfo?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={studentsLists?.in || []}
        notIn={studentsLists?.notIn || []}
        onSubmit={(listIn: number[], listNotIn: number[]) => {
          asignStudents({
            programId: +programId,
            programUserAssignRequest: {
              idsIn: listIn,
              idsNotIn: listNotIn,
            },
          });
          router.push(
            routes.admin.programs.programInfoByIdAndTab(programId, "students")
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.programs.programInfoByIdAndTab(programId, "students")
          )
        }
      />
    </Box>
  );
}
