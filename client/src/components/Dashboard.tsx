import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import React from "react";
import MetricCard from "./MetricCard";

const Dashboard: React.FC = () => {
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
            {/* <IconButton color="inherit" size="small">
              <CalendarTodayRoundedIcon fontSize="small" />
            </IconButton> */}
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              sx={{
                width: 40,
                height: 40,
                border: "2px solid rgba(255,255,255,0.8)",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 2.5, mt: -2 }}>
        <Box sx={{ mb: 3, pt: 4 }}>
          <Typography variant="h5" color="text.primary" sx={{ mb: 0.5 }}>
            Good Morning, Alex
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here is your health summary for today.
          </Typography>
        </Box>

        {/* Metrics */}
        <MetricCard
          title="Resting HR"
          icon={<FavoriteRoundedIcon sx={{ color: "#e57373" }} />}
          value={62}
          unit="bpm"
          badge={
            <Chip
              size="small"
              label="↘ 2 bpm"
              sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }}
            />
          }
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
          title="Body Weight"
          icon={<ScaleRoundedIcon sx={{ color: "#00796b" }} />}
          value={75.4}
          unit="kg"
          badge={
            <Chip
              size="small"
              label="↗ 0.2 kg"
              sx={{ bgcolor: "#ffebee", color: "#c62828", fontWeight: 600 }}
            />
          }
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
          title="Workout RPE"
          icon={<FitnessCenterRoundedIcon sx={{ color: "#5c6bc0" }} />}
          subtext="Rate 1-10 intensity"
          badge={
            <Chip
              size="small"
              label="Pending"
              sx={{ bgcolor: "#fff3e0", color: "#ef6c00", fontWeight: 600 }}
            />
          }
          action={
            <Button
              variant="contained"
              color="primary"
              disableElevation
              startIcon={<AddRoundedIcon />}
              sx={{ borderRadius: 2 }}
            >
              Log Now
            </Button>
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
