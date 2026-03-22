"use client";

import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/shared/config/routes";
import CourseInfoCard from "@/entities/course/ui/CourseInfoCard";
import { useGetAllCoursesQuery } from "@/entities/course/model/coursesApi";
import SectionsList from "@/features/coursesManagement/ui/SectionsList";
import { useState } from "react";
import SectionModalForm from "@/entities/section/ui/SectionModal";
import {
  CreateSectionRequest,
  useCreateSectionMutation,
  useDeleteSectionMutation,
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
} from "@/entities/section/model/sectionsApi";

export default function CoursesPage() {
  const router = useRouter();
  const { currentData: sections } = useGetAllCoursesQuery();
  const { currentData: allSections } = useGetAllSectionsQuery();
  const searchParams = useSearchParams();
  const activeSectionId = searchParams?.get("sectionId");
  const activeSection = activeSectionId
    ? sections?.find((section) => section.id === +activeSectionId) ||
      allSections?.find((section) => section.id === +activeSectionId)
    : undefined;

  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] =
    useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);

  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  return (
    <Box>
      {allSections && sections && (
        <Box display={"flex"} flexDirection={"row"}>
          {/* Список разделов */}
          <SectionsList
            sections={allSections}
            onSectionClik={function (sectionId: number | undefined): void {
              router.push(
                sectionId
                  ? routes.admin.courses.coursesBySectionId(sectionId)
                  : routes.admin.courses.allCourses
              );
            }}
            onCreateSectionClik={() => {
              setIsCreateSectionModalOpen(true);
            }}
            activeSectionId={activeSectionId ? +activeSectionId : undefined}
          />
          <Box
            flexGrow={1}
            p={"28px"}
            sx={{
              height: "calc(100vh)",
              overflowY: "auto",
            }}
          >
            {activeSection ? (
              <Box>
                {/* Отображение активного раздела */}

                <HeaderBox>
                  <Typography variant="h1" display={"inline"}>
                    {activeSection.title}
                  </Typography>
                  <Box>
                    {activeSection.id !== 1 && (
                      <Tooltip arrow title={"Редактировать раздел"}>
                        <IconButton
                          onClick={() => {
                            setIsEditSectionModalOpen(true);
                          }}
                        >
                          <EditOutlinedIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip arrow title={"Создать курс в разделе"}>
                      <IconButton
                        onClick={() => {
                          router.push(
                            routes.admin.courses.createCourseInSection(
                              activeSection.id
                            )
                          );
                        }}
                      >
                        <BookmarkAddOutlinedIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </HeaderBox>
                <Typography variant="body2" p={"16px"}>
                  {activeSection.description}
                </Typography>
                {"courses" in activeSection &&
                Array.isArray(activeSection.courses) ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      gap: 3,
                      p: 2,
                    }}
                  >
                    {activeSection.courses.map((course) => (
                      <CourseInfoCard courseInfo={course} key={course.id} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" p={"16px"}>
                    Курсы еще не добавлены в раздел
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                {/* Отображение всех разделов */}

                <HeaderBox>
                  <Typography variant="h1" display={"inline"}>
                    Все курсы
                  </Typography>
                  <Tooltip arrow title={"Создать курс"}>
                    <IconButton
                      onClick={() => {
                        router.push(routes.admin.courses.createCourse);
                      }}
                    >
                      <BookmarkAddOutlinedIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </HeaderBox>
                {sections.map((section) => (
                  <Box key={section.id}>
                    <Typography p={"16px"} variant="subtitle1">
                      {section.title}
                    </Typography>
                    {section.courses ? (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                            lg: "repeat(4, 1fr)",
                          },
                          gap: 3,
                          p: 2,
                        }}
                      >
                        {section.courses.map((course) => (
                          <CourseInfoCard courseInfo={course} key={course.id} />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2">
                        Курсы еще не добавлены в раздел
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
      {/* Окно для создания раздела */}
      <SectionModalForm
        open={isCreateSectionModalOpen}
        onSubmit={async (sectionInfo: CreateSectionRequest) => {
          try {
            const newSection = await createSection(sectionInfo).unwrap();
            setIsCreateSectionModalOpen(false);
            router.push(routes.admin.courses.coursesBySectionId(newSection.id));
          } catch (err: any) {
            console.log(err);
          }
        }}
        onClose={() => {
          setIsCreateSectionModalOpen(false);
        }}
        onDelete={(sectionId: number) => {
          try {
            deleteSection(sectionId);
          } catch (err) {
            console.log(err);
          }
        }}
        isCreation={true}
      />

      {/* Окно для редактирования раздела */}
      <SectionModalForm
        open={isEditSectionModalOpen}
        onSubmit={async (sectionInfo: CreateSectionRequest) => {
          try {
            if (activeSectionId)
              await updateSection({
                sectionId: +activeSectionId,
                updateSectionRequest: sectionInfo,
              });
            setIsEditSectionModalOpen(false);
          } catch (err: any) {
            console.log(err);
          }
        }}
        onDelete={(sectionId: number) => {
          try {
            deleteSection(sectionId);
            router.push(routes.admin.courses.allCourses);
          } catch (err) {
            console.log(err);
          }
        }}
        onClose={() => {
          setIsEditSectionModalOpen(false);
        }}
        isCreation={false}
        currentValues={activeSection}
      />
    </Box>
  );
}
