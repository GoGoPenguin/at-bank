import {
  Delete,
  Edit,
  MoreVert,
  PauseCircle,
  PlayCircle,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";

type JobType = "Tournament" | "Individual" | "Department";
type JobStatus = "Active" | "Paused" | "Closed";

export interface JobPosting {
  id: string;
  title: string;
  status: JobStatus;
  jobType: JobType;
  applicants: number;
  needsReview: number;
  datePosted: Date;
}

const jobTypeColors: Record<JobType, "primary" | "secondary" | "info"> = {
  Tournament: "info",
  Individual: "primary",
  Department: "secondary",
};

const jobStatusColors: Record<JobStatus, "success" | "warning" | "default"> = {
  Active: "success",
  Paused: "warning",
  Closed: "default",
};

const JobDashboardCard: React.FC<{ job: JobPosting }> = ({ job }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card
      variant="outlined"
      sx={{
        marginRight: "auto",
        height: "100%",
        width: "350px",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Chip
            label={job.jobType}
            color={jobTypeColors[job.jobType]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={job.status}
            color={jobStatusColors[job.status]}
            size="small"
            variant="outlined"
          />
        </Stack>
        <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Posted on {dayjs(job.datePosted).format("MMM d, YYYY")}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Button
          startIcon={<Visibility />}
          size="small"
          onClick={() => alert(`Viewing applicants for ${job.title}`)}
        >
          View Applicants ({job.applicants})
        </Button>
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
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          {job.status === "Active" && (
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
          )}
          <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Close Job</ListItemText>
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
};

export default JobDashboardCard;
