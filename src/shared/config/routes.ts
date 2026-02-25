export const routes = {
  auth: {
    login: "/login",
    activateAccount: "/activate",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  admin: {
    checking: {
      allTasks: "/admin/checking",
    },
    courses: {
      allCourses: "/admin/courses",
    },
    groups: "/admin/groups",
    profile: "/admin/profile",
    users: {
      allUsers: "/admin/users",
      createUser: "/admin/users/create",
      userById: (id: string | number) => `/admin/users/${id}`,
      editUserById: (id: string | number) => `/admin/users/${id}/edit`,
    },
  },
  student: {
    courses: "/student/courses",
    learning: "/student/learning",
    profile: "/student/profile",
    programs: "/student/programs",
  },
};
