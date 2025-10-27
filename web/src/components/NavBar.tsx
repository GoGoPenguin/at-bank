import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";
import { ROLE_DEPARTMENT } from "../types/user.type";
import Profile from "./Profile";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function NavBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const { signOut } = useApi();
  const { clearUser, user } = useAuthStore();
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearUser();
      navigate("/sign-in", { replace: true });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <AppBar
      position="static"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "28px",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{ height: "54px" }}>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <img src={Logo} alt="Logo" width={100} height={30} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {user && user.role === ROLE_DEPARTMENT && (
                <>
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => navigate("/")}
                  >
                    {t("profileMenu.home")}
                  </Button>
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => navigate("/application-record")}
                  >
                    {t("profileMenu.applicationRecord")}
                  </Button>
                </>
              )}
              {/* <Button variant="text" color="info" size="small">
                Testimonials
              </Button>
              <Button variant="text" color="info" size="small">
                Highlights
              </Button>
              <Button variant="text" color="info" size="small">
                Pricing
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                FAQ
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
              >
                Blog
              </Button> */}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Divider orientation="vertical" variant="middle" flexItem />
            <Profile />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    top: "var(--template-frame-height, 0px)",
                  },
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem> */}
                <MenuItem>{t("profileMenu.profile")}</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={handleSignOut}>
                  <Button color="primary" variant="contained" fullWidth>
                    {t("profileMenu.signOut")}
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
