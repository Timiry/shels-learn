import PdfIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TextIcon from "@mui/icons-material/MenuBookOutlined";
import VideoIcon from "@mui/icons-material/SmartDisplayOutlined";
import TestIcon from "@mui/icons-material/ChecklistOutlined";
import TaskIcon from "@mui/icons-material/LiveHelpOutlined";

const lessonTypeToIcon = {
  THEORY_TEXT: <TextIcon fontSize="large" />,
  THEORY_VIDEO: <VideoIcon fontSize="large" />,
  THEORY_PDF: <PdfIcon fontSize="large" />,
  PRACTICE_TEST: <TestIcon fontSize="large" />,
  PRACTICE_OPEN_ANSWER: <TaskIcon fontSize="large" />,
};

export default lessonTypeToIcon;
