import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LessonOption({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <Box
      p={1}
      border={"1px solid"}
      borderColor={"divider"}
      borderRadius={1}
      display={"inline"}
    >
      <Typography variant="body1" display={"inline"}>
        {`${name}: `}
      </Typography>
      <Typography variant="body1" color="secondary" display={"inline"}>
        {value}
      </Typography>
    </Box>
  );
}
