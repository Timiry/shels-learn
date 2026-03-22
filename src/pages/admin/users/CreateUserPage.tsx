"use client";

import {
  UpdateUserRequest,
  useCreateUserMutation,
} from "@/entities/user/model/usersApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const formId = "user-create-form";
  const [createUser] = useCreateUserMutation();
  const router = useRouter();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Создание пользователя
        </Typography>
        <Button variant="contained" size="large" type="submit" form={formId}>
          Создать
        </Button>
      </HeaderBox>
      <Box m={"28px"} display="flex" justifyContent="center">
        <Box width="70%">
          <EditUserForm
            onSubmit={async (userInfo: UpdateUserRequest) => {
              const user = await createUser(userInfo).unwrap();
              if (user.id)
                router.push(
                  routes.admin.users.userByIdAndTab(user.id, "courses")
                );
            }}
            formId={formId}
            isCreation={true}
            isAdmin={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
