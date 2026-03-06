export type LessonType =
  | "THEORY_TEXT"
  | "THEORY_VIDEO"
  | "THEORY_PDF"
  | "PRACTICE_TEST"
  | "PRACTICE_OPEN_ANSWER";

export type UpdateCourseApiArg = {
  courseId: number;
  createCourseRequest: CreateCourseRequest;
};
export type UpdateTheoryLessonApiArg = {
  courseId: number;
  lessonId: number;
  updateTheoryLessonRequest: CreateTheoryLessonRequest;
};
export type UpdatePracticeLessonApiArg = {
  courseId: number;
  lessonId: number;
  updatePracticeLessonRequest: CreatePracticeLessonRequest;
};
export type AssignReviewerApiArg = {
  courseId: number;
  userInNotInRequest: UserInNotInRequest;
};
export type UnassignReviewerApiArg = {
  courseId: number;
  idsRequest: IdsRequest;
};
export type CreateTheoryLessonApiArg = {
  courseId: number;
  createTheoryLessonRequest: CreateTheoryLessonRequest;
};
export type CreatePracticeLessonApiArg = {
  courseId: number;
  createPracticeLessonRequest: CreatePracticeLessonRequest;
};

export type AssignStudentApiArg = {
  courseId: number;
  userInNotInRequest: UserInNotInRequest;
};

export type GetLessonApiArg = {
  courseId: number;
  lessonId: number;
};
export type DeleteLessonApiArg = {
  courseId: number;
  lessonId: number;
};
export type CourseDto = {
  id: number;
  title: string;
  description?: string;
  authorFullName?: string;
  coverFilePath?: string;
  passingThresholdPercent?: number;
  deadlineDays?: number;
  lessonsFreeOrder?: boolean;
  allowContinueAfterFail?: boolean;
  blockAfterDeadline?: boolean;
  keepAccessAfterDeadline?: boolean;
  includeInOverallStats?: boolean;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
};
export type PracticeQuestionDto = {
  id: number;
  index?: number;
  questionType:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "MATCHING"
    | "ORDERING"
    | "OPEN_ANSWER";
  questionText: string;
  trainerHint?: string;
  options: string[];
  correctAnswers: string[];
  fullPoints: number;
  partialPoints: number;
};
export type LessonDto = {
  id: number;
  courseId: number;
  position: number;
  title: string;
  description?: string;
  stopLesson?: boolean;
  blockedDuringAttempt?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType: LessonType;
  theoryContentType?: "HTML_TEXT" | "VIDEO_URL" | "PDF_FILE";
  theoryContent?: string;
  fullPoints: number;
  partialPoints?: number;
  passingThresholdPercent?: number;
  evaluateByCorrectCount?: boolean;
  randomQuestionCount?: number;
  shuffleOnEveryAttempt?: boolean;
  showCorrectAnswersAfterCompletion?: boolean;
  questions?: PracticeQuestionDto[];
};
export type CourseAdminDetailsDto = {
  course: CourseDto;
  lessons?: LessonDto[];
};
export type ApiResponse = {
  message?: string;
};
export type CreateCourseRequest = {
  title: string;
  description?: string;
  authorFullName?: string;
  coverFilePath?: string;
  passingThresholdPercent?: number;
  deadlineDays?: number;
  lessonsFreeOrder?: boolean;
  allowContinueAfterFail?: boolean;
  blockAfterDeadline?: boolean;
  keepAccessAfterDeadline?: boolean;
  includeInOverallStats?: boolean;
  sectionId?: number;
  lessonIdToPosition?: {
    [key: string]: number;
  };
};

export type PracticeQuestionRequest = {
  position?: number;
  questionType?:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "MATCHING"
    | "ORDERING"
    | "OPEN_ANSWER";
  questionText: string;
  trainerHint?: string;
  options?: string[];
  correctAnswers?: string[];
  fullPoints?: number;
  partialPoints?: number;
};

export type LearningProgramCourseDto = {
  courseId?: number;
  courseTitle?: string;
  orderIndex?: number;
  deadlineAt?: string;
  blockAfterDeadline?: boolean;
  available?: boolean;
  completed?: boolean;
  viewedOrPending?: boolean;
};

export type ProgramCourseSettingsRequest = {
  courseId: number;
};

export type CourseSummaryDto = {
  id: number;
  title: string;
  description: string;
  ptiority: number;
  courses: CourseMiniInfo[];
};

export type CourseMiniInfo = {
  id: number;
  title: string;
  description?: string;
  coverFilePath?: string;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
  theoryLessonsCount: number;
  practiceLessonsCount: number;
};
export type IdsRequest = {
  ids: number[];
};
export type CreateTheoryLessonRequest = {
  title: string;
  description?: string;
  coverFilePath?: string;
  requiresPreviousCompleted?: boolean;
  openForAccess?: boolean;
  stopLesson?: boolean;
  blockedDuringAttempt?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  contentType: "HTML_TEXT" | "VIDEO_URL" | "PDF_FILE";
  content: string;
  fullPoints: number;
  questionIdToPosition?: {
    [key: string]: number;
  };
};
export type CreatePracticeLessonRequest = {
  title: string;
  description?: string;
  coverFilePath?: string;
  requiresPreviousCompleted?: boolean;
  openForAccess?: boolean;
  stopLesson?: boolean;
  blockedDuringAttempt?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType:
    | "THEORY_TEXT"
    | "THEORY_VIDEO"
    | "THEORY_PDF"
    | "PRACTICE_TEST"
    | "PRACTICE_OPEN_ANSWER";
  partialPoints?: number;
  passingThresholdPercent?: number;
  evaluateByCorrectCount?: boolean;
  randomQuestionCount?: number;
  shuffleOptions?: boolean;
  showQuestionStatus?: boolean;
  showCorrectAnswers?: boolean;
  questions: PracticeQuestionRequest[];
};

export type UserDto = {
  id?: number;
  fullName?: string;
  email?: string;
  role?: "ADMIN" | "STUDENT";
  activation?: boolean;
  enabled?: boolean;
  phone?: string;
  comment?: string;
  avatarFilePath?: string;
  createdAt?: string;
  createdBy?: string;
  lastVisit?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
};
export type UserInNotInListsDto = {
  in?: UserDto[];
  notIn?: UserDto[];
};
export type UserInNotInRequest = {
  idsIn?: number[];
  idsNotIn?: number[];
};
export type EnrollmentRequest = {
  idsToEnroll?: number[];
  idsToUnenroll?: number[];
};
