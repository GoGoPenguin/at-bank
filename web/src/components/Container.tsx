import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const Container = styled(Stack)(({ theme }) => ({
  height: "auto",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default Container;
