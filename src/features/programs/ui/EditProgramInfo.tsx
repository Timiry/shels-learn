"use client";

import {
  CreateLearningProgramRequest,
  UpdateProgramApiArg,
  ProgramDto,
} from "@/features/programs/model/programsApi";
import { routes } from "@/shared/config/routes";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import { Box, Stack, Button } from "@mui/material";
import EditProgramForm from "./EditProgramForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditProgramInfoProps {
  programInfo: ProgramDto;
  onUpdate: (arg: UpdateProgramApiArg) => {};
  onDelete: (id: number) => void;
}

export default function EditProgramInfo({
  programInfo,
  onUpdate,
  onDelete,
}: EditProgramInfoProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();
  const formId = "program-update-form";
  return (
    <Box m={"28px"} display={"flex"}>
      <Box pl={"50px"} flex={1}>
        <EditProgramForm
          onSubmit={async (program: CreateLearningProgramRequest) => {
            try {
              await onUpdate({
                programId: programInfo.id,
                createLearningProgramRequest: program,
              });

              router.push(
                routes.admin.programs.programInfoByIdAndTab(
                  programInfo.id,
                  "description"
                )
              );
            } catch (err) {}
          }}
          formId={formId}
          isCreation={false}
          currentValues={programInfo}
        />
        <Stack spacing={3} direction={"row"} justifyContent={"flex-end"} mt={3}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            form={formId}
            sx={{ mr: 5 }}
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Удалить
          </Button>
        </Stack>
      </Box>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDelete(programInfo?.id);
          router.push(routes.admin.programs.allPrograms);
        }}
        objectname={programInfo.title}
        objectType="program"
      />
    </Box>
  );
}
