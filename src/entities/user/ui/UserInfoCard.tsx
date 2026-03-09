import { Avatar, Button, Stack, Typography } from "@mui/material";
import { UserDto } from "../model/usersApi";

export default function UserInfoCard({
  user,
  onEditClick,
}: {
  user: UserDto;
  onEditClick: () => void;
}) {
  return (
    <Stack
      width={"350px"}
      height={"calc(100vh)"}
      p={"14px"}
      spacing={2}
      alignItems={"center"}
    >
      <Avatar
        sx={{ width: 140, height: 140, m: "14px" }}
        src={
          user.avatarFilePath
            ? "http://217.26.31.189" + user.avatarFilePath
            : ""
        }
      />
      <Typography variant="subtitle2" color="text.secondary">
        {user.role === "ADMIN" ? "АДМИНИСТРАТОР" : "СТУДЕНТ"}
      </Typography>
      <Typography variant="h2" textAlign={"center"}>
        {user.fullName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {user.email}
      </Typography>
      <Button variant="outlined" onClick={() => onEditClick()}>
        Редактировать профиль
      </Button>
      <Stack alignItems={"center"}>
        <Typography variant="caption" color="text.secondary">
          Последний визит:
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.lastVisit}
        </Typography>
      </Stack>
      <Stack alignItems={"center"}>
        <Typography variant="caption" color="text.secondary">
          Зарегистрирован:
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.createdBy}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.createdAt}
        </Typography>
      </Stack>
    </Stack>
  );
}
