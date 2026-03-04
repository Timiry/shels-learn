"use client";

import {
  useDeleteCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
} from "@/entities/course/model/coursesApi";
import { CourseAdminDetailsDto } from "@/entities/course/model/types";
import EditCourseInfo from "@/features/coursesManagement/ui/EditCourseInfo";
import EditCourseLessons from "@/features/coursesManagement/ui/EditCourseLessons";
import HeaderBox from "@/shared/ui/HeaderBox";
import TabNavigation from "@/shared/ui/TabNavigation";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditCoursePage() {
  const [activeTab, setActiveTab] = useState("info");

  const params = useParams();
  const courseId = params?.id as string;
  // const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  // мок:
  const courseInfo: CourseAdminDetailsDto = {
    course: {
      id: 1,
      title: "Основы программирования на JavaScript",
      description:
        "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
      coverFilePath: "/cover.png",
    },
    lessons: [
      {
        title: "Текстовый урок",
        id: 0,
        courseId: 0,
        position: 0,
        lessonType: "THEORY_TEXT",
        theoryContent:
          '<ol style="margin-bottom: 0px; margin-top: 0px;" start="1" type="1">\n <li class="MsoNormal" style="margin: 0px 0px 0px 48px; text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif;"><strong><span style="line-height: 107%;">Функциональные требования</span></strong></li>\n</ol>\n\n<p class="MsoNormal" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 48px;"><span style="line-height: 107%;">&nbsp;</span><br></p>\n\n<p class="MsoNormal" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 48px;"><strong><span style="line-height: 107%;">Базовые\nфункции </span></strong><strong><span lang="EN-US" style="line-height: 107%;">MVP</span></strong><strong><span style="line-height: 107%;">:</span></strong></p>\n\n<p class="MsoNormal" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 48px;"><strong><span style="line-height: 107%;">&nbsp;</span></strong><br></p>\n\n<p class="MsoListParagraphCxSpFirst" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>1.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Создание и редактирование пользователей</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Информация, указываемая о\nпользователе: ФИО, </span><span lang="EN-US" style="line-height: 107%;">email</span><span style="line-height: 107%;">, логин, пароль, тип учетной записи (роль)</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>2.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Создание и редактирование курсов </span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">При создании вводится\nинформация о курсе (название, описание, фото для обложки, порог прохождения\nкурса)</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Содержание курса состоит из\nуроков, которые могут быть:</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 167px; text-indent: -24px;"><span style="line-height: 107%; font-family: &quot;Courier New&quot;;"><span>o<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Теоретическими: в виде текста, видео или </span><span lang="EN-US" style="line-height: 107%;">pdf</span><span style="line-height: 107%;">\nфайла. Видео-урок можно создать, указав ссылку на видео, размещенное на </span><span lang="EN-US" style="line-height: 107%;">YouTube</span><span style="line-height: 107%;">.</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 167px; text-indent: -24px;"><span style="line-height: 107%; font-family: &quot;Courier New&quot;;"><span>o<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Практическими: в виде набора тестовых вопросов (один верный ответ,\nмножество верных ответов, сопоставление, размещение ответов в нужном порядке) или\nнабора вопросов с развернутым ответом</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Баллы за прохождение уроков\n- есть настройка по умолчанию, есть настройка в каждом созданном уроке. В тесте\nс множественным ответом можно выставить баллы за частично правильный ответ.</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>3.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Зачисление и отчисление отдельных студентов на курсы</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">В настройках курса\nотображаются два списка - не зачисленных и зачисленных студентов, можно\nвыбирать студентов в одном списке и перемещать их в другой</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>4.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Назначение проверяющих администраторов </span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">В настройках курса по\nаналогии с зачислением студентов можно выбрать из пользователей с ролью\n«администратор» тех, кто будет проверять задания с развернутым ответом, в их\nличном профиле появится вкладка «Проверка» со списком назначенных курсов и заданий,\nожидающих проверки</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>5.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Прохождение курсов</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Просмотр теории и\nпрохождение тестов проверяется автоматически, после чего сразу зачисляются\nбаллы</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">После отправки ответов на\nвопросы с развернутым ответом, ожидается проверка от проверяющего администратора,\nкогда проверка выполнена, урок считается пройденным и зачисляются полученные\nбаллы </span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>6.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Просмотр личной статистики по прохождению курсов </span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Отображается в личном\nпрофиле для студентов и на странице конкретного пользователя для\nадминистраторов</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Выводимая информация: название\nкурса, количество полученных баллов, эффективность, процент выполнения</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>7.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Просмотр статистики по конкретному курсу</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Отображается на странице\nинформации о курсе</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Выводимая информация: ФИО\nстудента, количество полученных баллов, эффективность, процент выполнения, дата\nзачисления, дата начала прохождения курса, дата завершения</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 72px; text-indent: -24px;"><span style="line-height: 107%;"><span>8.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;\n</span></span></span><span style="line-height: 107%;">Просмотр сводного отчета по завершениям</span></p>\n\n<p class="MsoListParagraphCxSpMiddle" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Отображается по нажатию\nсоответствующей кнопки на странице каталога курсов</span></p>\n\n<p class="MsoListParagraphCxSpLast" style="text-align: justify; line-height: 107%; font-size: 19px; font-family: &quot;Times New Roman&quot;, serif; margin: 0px 0px 0px 120px; text-indent: -24px;"><span style="line-height: 107%; font-family: Symbol;"><span>·<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><span style="line-height: 107%;">Выводимая информация: ФИО\nстудента, </span><span lang="EN-US" style="line-height: 107%;">email</span><span style="line-height: 107%;">, логин, название курса, количество полученных баллов,\nэффективность, дата зачисления, дата начала прохождения курса, дата завершения</span></p>',
        theoryContentType: "HTML_TEXT",
        fullPoints: 1,
      },
      {
        title: "PDF",
        id: 1,
        courseId: 0,
        position: 1,
        lessonType: "THEORY_PDF",
        theoryContent:
          "https://vk.com/doc334396385_696100732?hash=4PVkDhuUCOkatue8647wBUoxlWWwyAVzGNxtViiYkiz&dl=CCFgmowoe9prXr6bfS5hZYJEo0YNYcuZge9UHui3SGo&from_module=vkmsg_desktop",
        theoryContentType: "PDF_FILE",
        fullPoints: 1,
      },
      {
        title: "Видео",
        id: 2,
        courseId: 0,
        position: 2,
        lessonType: "THEORY_VIDEO",
        theoryContent: "https://www.youtube.com/watch?v=dVTEd7GTlok",
        theoryContentType: "VIDEO_URL",
        fullPoints: 1,
      },
      {
        title: "Тест",
        id: 3,
        courseId: 0,
        position: 3,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 4,
        courseId: 0,
        position: 4,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
      {
        title: "Видео",
        id: 5,
        courseId: 0,
        position: 5,
        lessonType: "THEORY_VIDEO",
      },
      {
        title: "Тест",
        id: 6,
        courseId: 0,
        position: 6,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 7,
        courseId: 0,
        position: 7,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
      {
        title: "Тест",
        id: 8,
        courseId: 0,
        position: 8,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 9,
        courseId: 0,
        position: 9,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
    ],
  };

  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Редактор курса</Typography>
          <Typography variant="body2" color="secondary">
            {courseInfo?.course?.title}
          </Typography>
        </Box>
      </HeaderBox>

      <TabNavigation
        tabs={[
          { id: "info", label: "ИНФОРМАЦИЯ" },
          { id: "lessons", label: "УРОКИ" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === "info" && (
          <Box>
            {courseInfo !== undefined && (
              <EditCourseInfo
                courseInfo={courseInfo.course}
                onUpdate={updateCourse}
                onDelete={deleteCourse}
              />
            )}
          </Box>
        )}
        {activeTab === "lessons" && (
          <EditCourseLessons
            courseId={+courseId}
            lessons={courseInfo.lessons || []}
          />
        )}
      </TabNavigation>
    </Box>
  );
}
