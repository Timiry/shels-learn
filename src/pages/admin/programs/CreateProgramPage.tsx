"use client";

import {
  CreateLearningProgramRequest,
  useCreateProgramMutation,
} from "@/features/programs/model/programsApi";
import EditProgramForm from "@/features/programs/ui/EditProgramForm";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreateProgramPage() {
  const router = useRouter();
  const formId = "program-create-form";
  const [createProgram] = useCreateProgramMutation();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Создание Программы
        </Typography>
        <Button variant="contained" size="large" type="submit" form={formId}>
          Создать
        </Button>
      </HeaderBox>
      <Box m={"28px"} display={"flex"}>
        <Box flex={1}>
          <EditProgramForm
            onSubmit={async (programInfo: CreateLearningProgramRequest) => {
              try {
                const program = await createProgram(programInfo).unwrap();
                router.push(
                  routes.admin.programs.programInfoByIdAndTab(
                    program.id,
                    "description"
                  )
                );
              } catch (err) {}
            }}
            formId={formId}
            isCreation={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
