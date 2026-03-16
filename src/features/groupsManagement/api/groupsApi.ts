export type GroupType = "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";

export type GroupSummaryDto = {
  id: number;
  title: string;
  type: GroupType;
  studentsCount: number;
  coursesCount: number;
  programsCount: number;
};

export type LearningProgramDto = {
  id: number;
  title: string;
  courses: number[];
};
