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
      checkTaskById: (id: string | number) => `/admin/checking/${id}`,
    },
    courses: {
      allCourses: "/admin/courses",
      createCourse: "/admin/courses/create",
      courseById: (id: string | number) => `/admin/courses/${id}`,
      editCourseById: (id: string | number) => `/admin/courses/${id}/edit`,
      manageStudents: (id: string | number) =>
        `/admin/courses/${id}/manage-students`,
      manageReviewers: (id: string | number) =>
        `/admin/courses/${id}/manage-reviewers`,
    },
    groups: "/admin/groups",
    profile: "/admin/profile",
    editProfile: "/admin/profile/edit",
    users: {
      allUsers: "/admin/users",
      createUser: "/admin/users/create",
      userById: (id: string | number) => `/admin/users/${id}`,
      editUserById: (id: string | number) => `/admin/users/${id}/edit`,
    },
  },
  student: {
    courseById: (id: string | number) => `/student/learning/course/${id}`,
    lessonById: (courseId: string | number, lessonId: string | number) =>
      `/student/learning/course/${courseId}/lesson/${lessonId}`,
    learning: "/student/learning",
    profile: "/student/profile",
    editProfile: "/student/profile/edit",
    programs: "/student/programs",
  },
};
