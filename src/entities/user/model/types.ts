export type UserRole = "ADMIN" | "STUDENT";

// вся инфа о юзере, получаемая с сервера
export type UserDto = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  phone?: string;
  comment?: string;
  createdAt?: string;
  createdBy?: string;
  lastVisit?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
  avatarUrl?: string;
};

// еще эндпоинт по загрузке фото профиля

// инфа для создания или редактирования юзера, отправляется на сервер
export type UserCreateEditInfo = {
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  comment?: string;
  password?: string;
};
