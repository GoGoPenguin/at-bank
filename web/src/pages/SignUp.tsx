import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "650px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

interface SplitPanelProps {
  image: string;
}

const SplitPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== "image",
})<SplitPanelProps>(({ theme, image }) => ({
  flex: 1, // Takes up equal width
  height: "100%", // Full viewport height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: theme.palette.common.white, // Dark text over images
  position: "relative", // For pseudo-elements or overlays
  overflow: "hidden", // Ensure background image doesn't overflow
  // The pseudo-element creates the background image layer with a dark overlay
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
    filter: "brightness(0.5) blur(2px)", // Darkens the image to make text readable
    transition: "transform 0.4s ease, filter 0.4s ease",
  },

  // On hover, the panel expands slightly and the image becomes clearer
  "&:hover": {
    "&::before": {
      transform: "scale(1.05)",
      filter: "brightness(0.6) blur(0px)",
    },
  },
}));

const ContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  zIndex: 2, // Above the background image and overlay
  padding: "2rem",
  maxWidth: "400px", // Limit content width for better readability
  height: "350px",
});

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTrainerRegister = () => {
    navigate("/sign-up/trainer");
  };

  const handleDepartmentRegister = () => {
    navigate("/sign-up/department");
  };

  return (
    <Card variant="outlined">
      <img src={Logo} alt="Logo" width={100} />
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {t("signUp.title")}
      </Typography>
      <Box
        component="form"
        // onSubmit={onSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 2,
        }}
      >
        <SplitPanel
          image={
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1470&q=80"
          }
        >
          <ContentBox>
            <Typography variant="h3" gutterBottom>
              {t("signUp.forAthleticTrainers")}
            </Typography>
            <Typography variant="h6">
              {t("signUp.athleticTrainerDescription")}
            </Typography>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              variant="contained"
              size="large"
              onClick={handleTrainerRegister}
              sx={{ mt: 3 }}
            >
              {t("signUp.athleticTrainerButton")}
            </Button>
          </ContentBox>
        </SplitPanel>
        <SplitPanel
          image={
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1587&q=80"
          }
        >
          <ContentBox>
            <Typography variant="h3" gutterBottom>
              {t("signUp.forDepartment")}
            </Typography>
            <Typography variant="h6">
              {t("signUp.departmentDescription")}
            </Typography>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              variant="contained"
              size="large"
              onClick={handleDepartmentRegister}
              sx={{ mt: 3 }}
            >
              {t("signUp.departmentButton")}
            </Button>
          </ContentBox>
        </SplitPanel>
      </Box>
      <Divider>{t("common.or")}</Divider>
      <Typography sx={{ textAlign: "center" }}>
        {t("signUp.alreadyHaveAccount")}{" "}
        <Link href="/sign-in" variant="body2" sx={{ alignSelf: "center" }}>
          {t("signIn.title")}
        </Link>
      </Typography>
    </Card>
  );
}
