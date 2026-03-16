export type GroupType = "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";

export type GroupSummaryDto = {
  id: string;
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

export type CreateGroupRequest = {
  title: string;
  type: GroupType;
};

export type GroupDto = {
  id: string;
  title: string;
  type: GroupType;
};
