export type CourseDto = {
  courseId: number;
  title: string;
  discription?: string;
  coverUrl?: string;
};

export type CourseCreateEditInfo = {
  title: string;
  discription?: string;
};
