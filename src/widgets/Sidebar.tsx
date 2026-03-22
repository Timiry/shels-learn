"use client";

import BookOutlinedIcon from "@mui/icons-material/BookOutlined"; //курсы
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined"; //программы
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined"; //проверка
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined"; // группы
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"; //пользователи
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined"; //обучение
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"; //админ
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined"; //студент
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"; // профиль
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"; // выход

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { routes } from "@/shared/config/routes";
import { useMyProfileQuery } from "@/features/student/api/studentApi";
import { removeAuthToken } from "@/shared/lib/auth/cookies";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

export default function Sidebar() {
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();

  const { currentData: myProfile } = useMyProfileQuery();

  const globalRole = myProfile?.role;
  const activeRole = pathname?.includes("admin") ? "ADMIN" : "STUDENT";

  // Определяем, какие разделы показывать
  const items: NavigationItem[] =
    globalRole === "ADMIN" && activeRole === "ADMIN"
      ? [
          {
            id: "catalog",
            label: "Курсы",
            icon: BookOutlinedIcon,
            path: routes.admin.courses.allCourses,
          },
          {
            id: "programs",
            label: "Программы",
            icon: FormatListNumberedOutlinedIcon,
            path: routes.admin.programs.allPrograms,
          },
          {
            id: "verification",
            label: "Проверка",
            icon: EditNoteOutlinedIcon,
            path: routes.admin.checking.allTasks,
          },
          {
            id: "groups",
            label: "Группы",
            icon: Diversity3OutlinedIcon,
            path: "/admin/groups",
          },
          {
            id: "users",
            label: "Пользователи",
            icon: PeopleAltOutlinedIcon,
            path: routes.admin.users.allUsers,
          },
        ]
      : [
          {
            id: "courses",
            label: "Обучение",
            icon: AutoStoriesOutlinedIcon,
            path: routes.student.learning,
          },
        ];

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 80,
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          height: "100vh",
        },
      }}
    >
      {/* Аватар */}
      <Box sx={{ pt: 2, textAlign: "center" }}>
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            src={
              myProfile?.avatarFilePath
                ? "http://217.26.31.189" + myProfile.avatarFilePath
                : ""
            }
            sx={{
              width: 40,
              height: 40,
            }}
          ></Avatar>
        </IconButton>
      </Box>

      <ListItemIcon
        sx={{
          mt: 2,
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        {activeRole === "ADMIN" ? (
          <SettingsOutlinedIcon />
        ) : (
          <SchoolOutlinedIcon />
        )}
      </ListItemIcon>
      {/* Меню аватара */}
      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ minWidth: 250 }}
      >
        <MenuItem>
          <Typography variant="subtitle2">{myProfile?.fullName}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleMenuClick(
              activeRole === "ADMIN"
                ? routes.admin.profile
                : routes.student.profile
            )
          }
        >
          <AccountCircleOutlinedIcon sx={{ mr: 1.5 }} />
          <Typography variant="body2">Перейти в профиль</Typography>
        </MenuItem>
        {globalRole === "ADMIN" && (
          <MenuItem
            onClick={() => handleMenuClick(routes.admin.courses.allCourses)}
          >
            <SettingsOutlinedIcon sx={{ mr: 1.5 }} />
            <Typography variant="body2">Войти как администратор</Typography>
          </MenuItem>
        )}
        {globalRole === "ADMIN" && (
          <MenuItem onClick={() => handleMenuClick(routes.student.learning)}>
            <SchoolOutlinedIcon sx={{ mr: 1.5 }} />
            <Typography variant="body2">Войти как студент</Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            removeAuthToken();
            handleMenuClick(routes.auth.login);
          }}
        >
          <LogoutOutlinedIcon sx={{ mr: 1.5 }} />
          <Typography variant="body2">Выйти из аккаунта</Typography>
        </MenuItem>
      </Menu>
      {/* Навигация */}
      <List>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={
                item.id === "groups"
                  ? () => router.push(item.path + "/GENERAL")
                  : () => router.push(item.path)
              }
              sx={{
                minHeight: 56,
                bgcolor: isActive(item.path) ? "primary.light" : "transparent",
                "&.Mui-selected": {
                  borderRight: "2px solid",
                  borderRightColor: "primary.main",
                },
                "&:hover": {
                  bgcolor: isActive(item.path)
                    ? "primary.light"
                    : "action.hover",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  color: isActive(item.path)
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { fontSize: "8px", textTransform: "uppercase" },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
