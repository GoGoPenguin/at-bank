import {
  AlternateEmail,
  ArrowBackIosNew,
  ArrowForward,
  EmailOutlined,
  FitnessCenter,
  LockOutlined,
  PersonAddAlt1,
  PersonOutline,
  RemoveRedEyeOutlined,
  Security,
  VisibilityOffOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CustomDatePicker from "../components/CustomDatePicker";

// Shared theme identical to Login
const signUpTheme = createTheme({
  palette: {
    primary: {
      main: "#016C71", // Teal Call to Action
      contrastText: "#ffffff",
    },
    background: {
      default: "#F6F9FA", // Light grey
    },
    text: {
      primary: "#0B1527", // Dark Navy
      secondary: "#64748B",
    },
    error: {
      main: "#D9534F",
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            "& fieldset": {
              borderColor: "#E2E8F0",
            },
            "&:hover fieldset": {
              borderColor: "#CBD5E1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#016C71",
              borderWidth: "1px",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "14px 24px",
          fontSize: "16px",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#94A3B8",
          padding: "0 8px 0 0",
          "&.Mui-checked": {
            color: "#016C71",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 24,
            borderRadius: 4,
          }
        },
      },
    },
  },
});

const steps = [
  { labelKey: "signUp.steps.identity", icon: PersonOutline },
  { labelKey: "signUp.steps.metrics", icon: FitnessCenter },
  { labelKey: "signUp.steps.account", icon: LockOutlined },
];

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const CustomStepper = () => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, position: "relative" }}>
      {/* Background Line */}
      <Box sx={{ position: "absolute", top: "20px", left: "10%", right: "10%", height: "2px", bgcolor: "#E2E8F0", zIndex: 0 }} />
      {/* Progress Line */}
      <Box sx={{
        position: "absolute", top: "20px", left: "10%",
        width: activeStep === 0 ? "0%" : activeStep === 1 ? "40%" : "80%",
        height: "2px", bgcolor: "#016C71", zIndex: 1,
        transition: "width 0.3s ease-in-out"
      }} />

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= activeStep;
        return (
          <Box key={step.labelKey} sx={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, bgcolor: "background.default", px: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isActive ? "#016C71" : "#ffffff",
                border: isActive ? "none" : "2px solid #E2E8F0",
                color: isActive ? "#ffffff" : "#94A3B8",
                mb: 1,
                boxShadow: isActive ? "0 4px 10px rgba(1, 108, 113, 0.2)" : "none",
                transition: "all 0.3s",
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="caption" sx={{ color: isActive ? "#016C71" : "#94A3B8", fontWeight: 700, fontSize: "10px", letterSpacing: 0.5 }}>
              {t(step.labelKey)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );

  const Step1 = () => (
    <Box sx={{ animation: "fadeIn 0.5s" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: "text.primary" }}>
        {t("signUp.step1.title")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.5 }}>
        {t("signUp.step1.subtitle")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step1.fullName")}
        </Typography>
        <TextField
          fullWidth
          placeholder={t("signUp.step1.fullNamePlaceholder")}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonOutline sx={{ color: "#CBD5E1" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step1.email")}
        </Typography>
        <TextField
          fullWidth
          placeholder={t("signUp.step1.emailPlaceholder")}
          type="email"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailOutlined sx={{ color: "#CBD5E1" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: "flex", p: 2.5, bgcolor: "#ffffff", borderRadius: "16px", border: "1px solid #E2E8F0", mb: 6 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#E6F0F1", display: "flex", alignItems: "center", justifyContent: "center", mr: 2, flexShrink: 0 }}>
          <Security sx={{ color: "#016C71", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            {t("signUp.step1.privacyTitle")}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4, display: "block" }}>
            {t("signUp.step1.privacyDesc")}
          </Typography>
        </Box>
      </Box>

      <Button fullWidth variant="contained" disableElevation endIcon={<ArrowForward />} onClick={handleNext} sx={{ mb: 3 }}>
        {t("signUp.step1.nextBtn")}
      </Button>

      <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
        {t("signUp.step1.alreadyHaveAccount")} {" "}
        <Link component={RouterLink} to="/sign-in" sx={{ color: "#D9534F", textDecoration: "none", fontWeight: 600, "&:hover": { color: "#0B1527" } }}>
          {t("signUp.step1.signIn")}
        </Link>
      </Typography>
    </Box>
  );

  const Step2 = () => (
    <Box sx={{ animation: "fadeIn 0.5s" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: "text.primary" }}>
        {t("signUp.step2.title")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.5 }}>
        {t("signUp.step2.subtitle")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1 }}>
            {t("signUp.step2.birthday")}
          </FormLabel>
          {/* <Controller
            name="birthday"
            // control={control}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value ? dayjs(field.value) : null}
                onChange={(v) => {
                  field.onChange(v ? v.toDate() : null);
                }}
                onBlur={field.onBlur}
                // error={!!errors.emtLicenseValidUntil}
                // helperText={t(
                //   errors.emtLicenseValidUntil?.message || ""
                // )}
                minDate={dayjs().add(1, "day")}
              />
            )}
          ></Controller> */}
          <CustomDatePicker
            value={null}
            // onChange={(v) => {
            //   field.onChange(v ? v.toDate() : null);
            // }}
            // onBlur={field.onBlur}
            // error={!!errors.emtLicenseValidUntil}
            // helperText={t(
            //   errors.emtLicenseValidUntil?.message || ""
            // )}
            onChange={function (newValue: dayjs.Dayjs | null): void {
              throw new Error("Function not implemented.");
            }} />
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step2.gender")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["Male", "Female", "Other"].map((g) => (
            <Button
              key={g}
              variant={gender === g ? "contained" : "outlined"}
              onClick={() => setGender(g as any)}
              sx={{
                flex: 1,
                bgcolor: gender === g ? "#EEF6F7" : "#ffffff",
                color: gender === g ? "#016C71" : "#0B1527",
                borderColor: gender === g ? "#016C71" : "#E2E8F0",
                "&:hover": {
                  bgcolor: gender === g ? "#E6F0F1" : "#F8FAFC",
                  borderColor: gender === g ? "#016C71" : "#CBD5E1",
                },
                boxShadow: "none",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {t(`signUp.step2.genders.${g.toLowerCase()}`)}
            </Button>
          ))}
        </Box>
      </Box>

      <Button fullWidth variant="contained" disableElevation endIcon={<ArrowForward />} onClick={handleNext} sx={{ mb: 3 }}>
        {t("signUp.step2.nextBtn")}
      </Button>

      <Typography variant="body2" align="center" sx={{ color: "text.secondary", fontWeight: 600, cursor: "pointer", "&:hover": { color: "#0B1527" } }} onClick={handleBack}>
        {t("signUp.step2.backBtn")}
      </Typography>
    </Box>
  );

  const Step3 = () => (
    <Box sx={{ animation: "fadeIn 0.5s" }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: "text.primary" }}>
        {t("signUp.step3.title")}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.5 }}>
        {t("signUp.step3.subtitle")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step3.account")}
        </Typography>
        <TextField
          fullWidth
          value=""
          placeholder={t("signUp.step3.accountPlaceholder")}
          type="account"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AlternateEmail sx={{ color: "#CBD5E1" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step3.password")}
        </Typography>
        <TextField
          fullWidth
          placeholder={t("signUp.step3.passwordPlaceholder")}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#94A3B8" }}>
                  {showPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Password Strength Indicator */}
      {/* <Box sx={{ display: "flex", gap: "4px", mb: 0.5 }}>
        <Box sx={{ height: 4, flex: 1, bgcolor: "#016C71", borderRadius: 2 }} />
        <Box sx={{ height: 4, flex: 1, bgcolor: "#016C71", borderRadius: 2 }} />
        <Box sx={{ height: 4, flex: 1, bgcolor: "#016C71", borderRadius: 2 }} />
        <Box sx={{ height: 4, flex: 1, bgcolor: "#E2E8F0", borderRadius: 2 }} />
      </Box>
      <Typography variant="caption" sx={{ color: "#016C71", fontWeight: 600, ml: 0.5, mb: 3, display: "block" }}>
        Strong password
      </Typography> */}

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}>
          {t("signUp.step3.confirmPassword")}
        </Typography>
        <TextField
          fullWidth
          placeholder={t("signUp.step3.confirmPasswordPlaceholder")}
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: "#94A3B8" }}>
                  {showConfirmPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Button fullWidth variant="contained" disableElevation endIcon={<PersonAddAlt1 />} onClick={() => { }} sx={{ mb: 3 }}>
        {t("signUp.step3.createBtn")}
      </Button>

      <Typography variant="body2" align="center" sx={{ color: "text.secondary", fontWeight: 600, cursor: "pointer", "&:hover": { color: "#0B1527" } }} onClick={handleBack}>
        {t("signUp.step3.backBtn")}
      </Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={signUpTheme}>
      {/* Global keyframes for smooth step transitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <Container maxWidth="xs" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1, py: 2 }}>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4, pt: 2 }}>
            <IconButton onClick={() => navigate("/sign-in")} sx={{ color: "#0B1527", ml: -1 }}>
              <ArrowBackIosNew sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: 700, mr: 3 }}>
              {t("signUp.title")}
            </Typography>
          </Box>

          {CustomStepper()}

          {/* Form Step Content */}
          <Box sx={{ flexGrow: 1 }}>
            {activeStep === 0 && Step1()}
            {activeStep === 1 && Step2()}
            {activeStep === 2 && Step3()}
          </Box>

          {/* iOS home indicator placeholder */}
          <Box sx={{ pb: 1, pt: 4, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 134, height: 5, bgcolor: "#CBD5E1", borderRadius: 10 }} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignUp;
