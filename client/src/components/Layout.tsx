import AddIcon from "@mui/icons-material/Add";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Fab,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", backgroundColor: "#F5F7FA" }}>
        <Outlet />
      </Box>

      <Box sx={{ position: "relative" }}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "absolute",
            zIndex: 1,
            top: -30,
            left: 0,
            right: 0,
            margin: "0 auto",
            border: "4px solid #F5F7FA", // Matches background
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
          onClick={() => navigate("/log")}
        >
          <AddIcon />
        </Fab>
        <BottomNavigation
          showLabels
          value={location.pathname}
          onChange={(_event, newValue) => {
            navigate(newValue);
          }}
          sx={{
            pb: 2,
            pt: 1,
            height: "auto",
            minHeight: "70px",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
              color: "#9E9E9E",
              "&.Mui-selected": {
                color: "#00796B",
              },
            },
          }}
        >
          <BottomNavigationAction
            label={t("layout.navigation.home")}
            value="/"
            icon={<HomeRoundedIcon />}
          />
          <BottomNavigationAction
            label={t("layout.navigation.history")}
            value="/history"
            icon={<HistoryRoundedIcon />}
          />
          <Box sx={{ width: "60px" }} /> {/* Spacer for FAB */}
          <BottomNavigationAction
            label={t("layout.navigation.trends")}
            value="/trends"
            icon={<TrendingUpRoundedIcon />}
          />
          <BottomNavigationAction
            label={t("layout.navigation.heartRate", { defaultValue: "Heart" })}
            value="/heart-rate"
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            label={t("layout.navigation.settings")}
            value="/settings"
            icon={<SettingsRoundedIcon />}
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Layout;
