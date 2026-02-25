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
      createCourse: "/admin/courses/create",
      courseById: (id: string | number) => `/admin/courses/${id}`,
      editCourseById: (id: string | number) => `/admin/courses/${id}/edit`,
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
