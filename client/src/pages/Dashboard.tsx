import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import Logout from "@mui/icons-material/Logout";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LetterAvatar from "../components/LetterAvatar";
import MetricCard from "../components/MetricCard";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";

const Dashboard: React.FC = () => {
  const { setUser } = useAuthStore();
  const { getMe, getMetrics } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user, isSuccess } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });
  const { data: metrics } = useQuery({
    queryKey: ["getMetrics"],
    queryFn: getMetrics,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(user);
    }
  }, [isSuccess, user, setUser]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    navigate("/sign-in");
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header Area */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: 4,
          pb: 3,
          px: 2.5,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ fontWeight: 600, letterSpacing: 1, opacity: 0.9 }}
            >
              {format(new Date(), "EEEE, MMM dd, yyyy", {
                locale: zhTW,
              }).toUpperCase()}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              AT Bank
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <LetterAvatar
                name={user?.name || ""}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(255,255,255,0.8)",
                }}
              />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">
                  {t("dashboard.menu.logout", "Log Out")}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 2.5, mt: -2 }}>
        <Box sx={{ mb: 3, pt: 4 }}>
          <Typography variant="h5" color="text.primary" sx={{ mb: 0.5 }}>
            {t(
              `dashboard.greeting.${
                new Date().getHours() < 12
                  ? "morning"
                  : new Date().getHours() < 18
                    ? "afternoon"
                    : new Date().getHours() < 21
                      ? "evening"
                      : "night"
              }`,
              { name: user?.name || "" },
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.greeting.summary")}
          </Typography>
        </Box>

        {/* Metrics */}
        <MetricCard
          title={t("dashboard.metrics.restingHR.title")}
          icon={<FavoriteRoundedIcon sx={{ color: "#e57373" }} />}
          value={
            metrics?.find((metric) => metric.name === "heart_rate")?.value ||
            undefined
          }
          unit={t("dashboard.metrics.restingHR.unit")}
          // badge={
          //   <Chip
          //     size="small"
          //     label={t("dashboard.metrics.restingHR.badge")}
          //     sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }}
          //   />
          // }
          chart={
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
                gap: "2px",
              }}
            >
              {[30, 40, 35, 50, 40, 45].map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    height: `${h}%`,
                    bgcolor: i === 5 ? "#e57373" : "#ffcdd2",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              ))}
            </Box>
          }
        />

        <MetricCard
          title={t("dashboard.metrics.bodyWeight.title")}
          icon={<ScaleRoundedIcon sx={{ color: "#00796b" }} />}
          value={
            metrics?.find((metric) => metric.name === "weight")?.value ||
            undefined
          }
          unit={t("dashboard.metrics.bodyWeight.unit")}
          // badge={
          //   <Chip
          //     size="small"
          //     label={t("dashboard.metrics.bodyWeight.badge")}
          //     sx={{ bgcolor: "#ffebee", color: "#c62828", fontWeight: 600 }}
          //   />
          // }
          chart={
            <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%" }}
              >
                <path
                  d="M0,30 Q25,10 50,25 T100,15"
                  fill="none"
                  stroke="#00796b"
                  strokeWidth="3"
                />
              </svg>
            </Box>
          }
        />

        <MetricCard
          title={t("dashboard.metrics.workoutRPE.title")}
          icon={<FitnessCenterRoundedIcon sx={{ color: "#5c6bc0" }} />}
          subtext={t("dashboard.metrics.workoutRPE.subtext")}
          value={
            metrics?.find((metric) => metric.name === "RPE")?.value || undefined
          }
          // badge={
          //   <Chip
          //     size="small"
          //     label={t("dashboard.metrics.workoutRPE.badge")}
          //     sx={{ bgcolor: "#fff3e0", color: "#ef6c00", fontWeight: 600 }}
          //   />
          // }
          chart={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Gauge
                width={100}
                height={100}
                value={
                  metrics?.find((metric) => metric.name === "RPE")?.value || 0
                }
                startAngle={-90}
                endAngle={90}
                valueMin={0}
                valueMax={10}
                sx={{
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#5c6bc0",
                  },
                  mb: 2,
                }}
              />
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
