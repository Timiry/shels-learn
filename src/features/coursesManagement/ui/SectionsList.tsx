import { SectionDto } from "@/entities/section/model/sectionsApi";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

interface SectionsListProps {
  activeSectionId?: number;
  sections: SectionDto[];
  onSectionClik: (sectionId: number | undefined) => void;
  onCreateSectionClik: () => void;
}

export default function SectionsList({
  activeSectionId,
  sections,
  onSectionClik,
  onCreateSectionClik,
}: SectionsListProps) {
  return (
    <Box
      sx={{
        minWidth: "300px",
        maxWidth: "300px",
        height: "calc(100vh - 40px)",
        mt: "40px",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <>
        <List
          sx={{ height: "calc(100vh - 90px)", overflowY: "auto", mx: "10px" }}
        >
          <ListItem
            key={0}
            onClick={() => onSectionClik(undefined)}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              bgcolor: activeSectionId ? "inherit" : "#EFF5FB",
              borderRadius: 1,
              borderRight: activeSectionId ? "none" : "4px solid",
              borderRightColor: activeSectionId ? "none" : "primary.main",
            }}
          >
            <ListItemText>
              <Typography noWrap variant="body1">
                Все курсы
              </Typography>
            </ListItemText>
          </ListItem>
          {sections.map((section) => (
            <ListItem
              key={section.id}
              onClick={() => onSectionClik(section.id)}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
                bgcolor: section.id === activeSectionId ? "#EFF5FB" : "inherit",
                borderRight:
                  section.id === activeSectionId ? "4px solid" : "none",
                borderRightColor:
                  section.id === activeSectionId ? "primary.main" : "none",

                borderRadius: 1,
              }}
            >
              <ListItemText>
                <Typography noWrap variant="body1">
                  {section.title}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Box textAlign={"center"} mx={2}>
          <Button variant="outlined" fullWidth onClick={onCreateSectionClik}>
            Добавить раздел
          </Button>
        </Box>
      </>
    </Box>
  );
}
