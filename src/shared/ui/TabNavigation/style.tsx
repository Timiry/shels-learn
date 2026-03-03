import { Tab, TabProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
  // variant: "subtitle2",
  fontSize: "0.75rem",
  minHeight: 48,
  padding: "0",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 116, 139, 0.12)",
  },
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: "rgba(100, 116, 139, 0.04)",
  },
  "& .MuiTab-iconWrapper": {
    marginBottom: 4,
  },
}));
