import { LessonType } from "@/entities/course/model/coursesApi";

export const routes = {
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    setPassword: "/set-password",
  },
  admin: {
    checking: {
      allTasks: "/admin/checking",
      checkTaskById: (id: string | number) => `/admin/checking/${id}`,
    },
    courses: {
      allCourses: "/admin/courses",
      coursesBySectionId: (sectionId: string | number) =>
        `/admin/courses?sectionId=${sectionId}`,
      createCourse: "/admin/courses/create",
      createCourseInSection: (sectionId: string | number) =>
        `/admin/courses/create?sectionId=${sectionId}`,
      courseInfoByIdAndTab: (id: string | number, tab: string) =>
        `/admin/courses/${id}/?tab=${tab}`,
      editCourseByIdAndTab: (id: string | number, tab: string) =>
        `/admin/courses/${id}/edit?tab=${tab}`,
      viewCourseLesson: (
        courseId: string | number,
        lessonId: string | number
      ) =>
        `/admin/courses/${courseId}/edit?tab=lessons&mode=view&lessonId=${lessonId}`,
      editCourseLesson: (
        courseId: string | number,
        lessonId: string | number
      ) =>
        `/admin/courses/${courseId}/edit?tab=lessons&mode=edit&lessonId=${lessonId}`,
      createCourseLesson: (courseId: string | number, lessonType: LessonType) =>
        `/admin/courses/${courseId}/edit?tab=lessons&mode=create&type=${lessonType}`,

      manageStudents: (id: string | number) =>
        `/admin/courses/${id}/manage-students`,
      manageReviewers: (id: string | number) =>
        `/admin/courses/${id}/manage-reviewers`,
    },
    programs: {
      allPrograms: "/admin/programs",
      createProgram: "/admin/programs/create",
      programInfoByIdAndTab: (id: string | number, tab: string) =>
        `/admin/programs/${id}/?tab=${tab}`,
      editProgramByIdAndTab: (id: string | number, tab: string) =>
        `/admin/programs/${id}/edit?tab=${tab}`,
      manageStudents: (id: string | number) =>
        `/admin/programs/${id}/manage-students`,
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
