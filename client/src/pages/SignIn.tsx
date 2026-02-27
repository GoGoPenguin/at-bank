import {
  AlternateEmail,
  ArrowForward,
  LockOutlined,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

// Custom theme specifically for the singIn page to match the exact design
const singInTheme = createTheme({
  palette: {
    primary: {
      main: "#016C71", // Teal Color from Sign In Button
      contrastText: "#ffffff",
    },
    background: {
      default: "#F6F9FA", // Light grey with slight blue tint
    },
    text: {
      primary: "#0B1527", // Very dark navy
      secondary: "#64748B", // Slate
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
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
  },
});

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={singInTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          position: "relative",
          // Dot pattern background
          backgroundImage: "radial-gradient(#E2E8F0 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            py: 4,
          }}
        >
          {/* Logo Area */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <img src={Logo} alt="Logo" width={250} height={75} />
            </Box>
            <Typography
              variant="caption"
              align="center"
              sx={{ color: "text.secondary", mb: 1 }}
            >
              {t("signIn.subtitle")}
            </Typography>
          </Box>

          {/* Form Area */}
          <Box component="form" noValidate sx={{ width: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "text.primary", mb: 1, ml: 0.5 }}
              >
                {t("signIn.account")}
              </Typography>
              <TextField
                fullWidth
                id="account"
                placeholder={t("signIn.accountPlaceholder")}
                name="account"
                autoComplete="account"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  px: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {t("signIn.password")}
                </Typography>
                <Link
                  href="#"
                  variant="caption"
                  sx={{
                    color: "#D9534F",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {t("signIn.forgotPassword")}
                </Link>
              </Box>

              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t("signIn.passwordPlaceholder")}
                autoComplete="current-password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <RemoveRedEyeOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              endIcon={<ArrowForward />}
              sx={{ py: 2, mb: 4, fontWeight: 700 }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              {t("signIn.signInBtn")}
            </Button>

            {/* Sign up */}
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "text.secondary", mb: 6 }}
            >
              {t("signIn.noAccount")}{" "}
              <Link
                component={RouterLink}
                to="/sign-up"
                variant="subtitle2"
                sx={{
                  color: "#D9534F",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("signIn.signUp")}
              </Link>
            </Typography>
          </Box>

          {/* iOS home indicator placeholder */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 134,
                height: 5,
                bgcolor: "#E2E8F0",
                borderRadius: 10,
              }}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;
