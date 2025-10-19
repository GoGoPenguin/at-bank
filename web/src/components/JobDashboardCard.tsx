import { Delete, Edit, MoreVert, PauseCircle } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Job, JobStatus, JobType } from "../types/job.type";

const jobTypeColors: Record<JobType, "primary" | "secondary" | "info"> = {
  tournament: "info",
  individual: "primary",
  department: "secondary",
};

const jobStatusColors: Record<JobStatus, "success" | "warning" | "default"> = {
  active: "warning",
  paused: "success",
  closed: "default",
};

const JobDashboardCard: React.FC<{ job: Job }> = ({ job }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const postedAtDiff = Date.now() - new Date(job.createdAt).getTime();
  const postedAtSeconds = Math.floor(postedAtDiff / 1000);
  const postedAtMinutes = Math.floor(postedAtDiff / 60000);
  const postedAtHours = Math.floor(postedAtDiff / 3600000);
  const postedAtDays = Math.floor(postedAtDiff / 86400000);
  const postedAtMonths = Math.floor(postedAtDiff / 2592000000);
  const postedAtYears = Math.floor(postedAtDiff / 31536000000);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 3,
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Chip
            label={t(`job.${job.type}`)}
            color={jobTypeColors[job.type]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={t(`job.${job.status}`)}
            color={job.status ? jobStatusColors[job.status] : "default"}
            size="small"
            variant="outlined"
          />
        </Stack>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mt: 2,
            mb: 1,
            flexGrow: 1,
          }}
        >
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("job.postedAt", {
            timeAgo:
              postedAtYears > 0
                ? t("time.year", { count: postedAtYears })
                : postedAtMonths > 0
                ? t("time.month", { count: postedAtMonths })
                : postedAtDays > 0
                ? t("time.day", { count: postedAtDays })
                : postedAtHours > 0
                ? t("time.hour", {
                    count: Math.max(postedAtHours, 1),
                  })
                : postedAtMinutes > 0
                ? t("time.minute", {
                    count: Math.max(postedAtMinutes, 1),
                  })
                : t("time.second", {
                    count: Math.max(postedAtSeconds, 1),
                  }),
          })}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
        }}
      >
        {/* NOTE: dummy container for future use */}
        <Container></Container>
        {/* <Button
          startIcon={<Visibility />}
          size="small"
          onClick={() => alert(`Viewing applicants for ${job.title}`)}
        >
          View Applicants ({job.applicants})
        </Button> */}
        <IconButton id={`more-button-${job.id}`} onClick={handleClick}>
          <MoreVert />
        </IconButton>
        <Menu
          id="more-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("common.edit")}</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PauseCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("common.pause")}</ListItemText>
          </MenuItem>
          {/* {job.applicationStatus === "Active" && (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PauseCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Pause</ListItemText>
            </MenuItem>
          )}
          {job.status === "Paused" && (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PlayCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Resume</ListItemText>
            </MenuItem>
          )} */}
          <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("common.close")}</ListItemText>
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

export default JobDashboardCard;
