import {
  LocationOnOutlined,
  MonetizationOnOutlined,
  PersonOutline,
} from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import EventIcon from "@mui/icons-material/Event";
import {
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import useLanguage from "../hooks/use-language";
import { APPLICATION_STATUS_PENDING, type Job } from "../types/job.type";
import LetterAvatar from "./LetterAvatar";

export default function JobDiscoveryCard({ job }: { job: Job }) {
  const navigate = useNavigate();
  const { handleAlert } = useContext(alertContext);
  const { saveJob, unsaveJob } = useApi();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isSaved, setIsSaved] = useState(job.isSaved);
  const [applicationStatus, setApplicationStatus] = useState(
    job.applicationStatus || undefined
  );
  const postedAtDiff = Date.now() - new Date(job.createdAt).getTime();
  const postedAtSeconds = Math.floor(postedAtDiff / 1000);
  const postedAtMinutes = Math.floor(postedAtDiff / 60000);
  const postedAtHours = Math.floor(postedAtDiff / 3600000);
  const postedAtDays = Math.floor(postedAtDiff / 86400000);
  const postedAtMonths = Math.floor(postedAtDiff / 2592000000);
  const postedAtYears = Math.floor(postedAtDiff / 31536000000);

  useEffect(() => {
    setIsSaved(job?.isSaved || false);
    setApplicationStatus(job?.applicationStatus || undefined);
  }, [job]);

  const handleSaveClick = () => {
    const action = isSaved ? unsaveJob : saveJob;
    action(job.id)
      .then(() => {
        setIsSaved((currentStatus) => !currentStatus);
        handleAlert(
          isSaved ? "unsavedSuccessfully" : "savedSuccessfully",
          "success"
        );
      })
      .catch(() => {
        handleAlert("networkError", "error");
      });
  };

  const handleApplyClick = () => {
    // TODO: Implement job application logic
    setApplicationStatus(APPLICATION_STATUS_PENDING);
    handleAlert("appliedSuccessfully", "info");
  };

  const formatDate = (date: Date, includeYear = false) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return includeYear
      ? `${month}/${day}/${date.getFullYear()}`
      : `${month}/${day}`;
  };

  const formatWorkShift = (job: Job) => {
    const startDate = new Date(job.shifts[0].date);
    const endDate = new Date(job.shifts[job.shifts.length - 1].date);
    const isSingleDay =
      job.shifts.length === 1 ||
      startDate.toDateString() === endDate.toDateString();
    const isCrossYear = startDate.getFullYear() !== endDate.getFullYear();

    if (isSingleDay)
      return `${formatDate(startDate)}, ${startDate.getFullYear()}`;
    return isCrossYear
      ? `${formatDate(startDate, true)} - ${formatDate(endDate, true)}`
      : `${formatDate(startDate)} - ${formatDate(
          endDate
        )}, ${startDate.getFullYear()}`;
  };

  const calculateTotalHours = (job: Job) => {
    return job.shifts.reduce(
      (sum, shift) => sum + (shift.endTime - shift.startTime) / 3600,
      0
    );
  };

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 3,
        mb: 2,
        borderRadius: 1,
        backgroundColor: "hsl(0, 0%, 100%)",
        [theme.breakpoints.up("sm")]: {
          maxWidth: "800px",
        },
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 3 },
        ...theme.applyStyles("dark", {
          backgroundColor: "hsl(220, 20%, 10%)",
        }),
      })}
    >
      <Stack
        spacing={2}
        sx={{ width: "100%" }}
        display={{ xs: "none", md: "flex" }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="column">
            <LetterAvatar
              variant="rounded"
              name={job.departmentName}
              sx={{ width: 56, height: 56 }}
            ></LetterAvatar>
          </Stack>
          <Stack direction="column" sx={{ width: "100%" }}>
            <Stack
              direction="row"
              gap={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="column" sx={{ maxWidth: "62%" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Link
                    onClick={() => navigate(`/job/${job.id}`)}
                    component="button"
                    type="button"
                    variant="h5"
                    sx={(theme) => ({
                      textAlign: "start",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      fontWeight: "bold",
                      "&:hover::before": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "1px",
                        bottom: 0,
                        left: 0,
                        backgroundColor: (theme.vars || theme).palette.text
                          .secondary,
                        opacity: 0.3,
                        transition: "width 0.3s ease, opacity 0.3s ease",
                      },
                      "&::before": {
                        width: 0,
                      },
                    })}
                  >
                    {job.title}
                  </Link>
                  <Chip
                    label={t(`job.${job.type.toLowerCase()}`)}
                    size="small"
                    variant="filled"
                    sx={(theme) => ({
                      mt: 0.5,
                      bgcolor:
                        theme.palette.mode === "dark" ? "grey.700" : "grey.300",
                      fontWeight: "bold",
                    })}
                  />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip
                    title={job.notes}
                    disableHoverListener={job.notes.length <= 120} // NOTE: Approximate check for overflow
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 400,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {job.notes}
                    </Typography>
                  </Tooltip>
                </Stack>
                <Stack
                  mt={1}
                  direction="row"
                  spacing={1}
                  color="text.secondary"
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.vacancies")}>
                      <PersonOutline fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">{job.vacancies}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.location")}>
                      <LocationOnOutlined fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {t(`cities.${job.city}`)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.date")}>
                      <EventIcon fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {formatWorkShift(job)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.hours")}>
                      <AccessTimeOutlinedIcon fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {t("time.hour", {
                        count: calculateTotalHours(job),
                      })}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.wage")}>
                      <MonetizationOnOutlined fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {Intl.NumberFormat(language, {
                        currency: "TWD",
                      }).format(job.wage)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="column">
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  display="flex"
                >
                  <Typography variant="caption" color="text.secondary">
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
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={
                      isSaved ? (
                        <BookmarkIcon />
                      ) : (
                        <BookmarkBorderOutlinedIcon />
                      )
                    }
                    onClick={handleSaveClick}
                  >
                    {isSaved ? t("job.saved") : t("job.save")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color={applicationStatus === undefined ? "primary" : "info"}
                    onClick={handleApplyClick}
                    disabled={applicationStatus !== undefined}
                  >
                    {applicationStatus === APPLICATION_STATUS_PENDING
                      ? t("job.pending")
                      : t("job.apply")}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        sx={{ width: "100%" }}
        display={{ xs: "flex", md: "none" }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="column">
            <LetterAvatar
              variant="rounded"
              name={job.departmentName}
              sx={{ width: 56, height: 56 }}
            ></LetterAvatar>
          </Stack>
          <Stack direction="column">
            <Stack direction="row" spacing={1} alignItems="center">
              <Link
                onClick={() => navigate(`/job/${job.id}`)}
                component="button"
                type="button"
                variant="h5"
                sx={(theme) => ({
                  fontWeight: "bold",
                  textAlign: "start",
                  "&:hover::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "1px",
                    bottom: 0,
                    left: 0,
                    backgroundColor: (theme.vars || theme).palette.text
                      .secondary,
                    opacity: 0.3,
                    transition: "width 0.3s ease, opacity 0.3s ease",
                  },
                  "&::before": {
                    width: 0,
                  },
                })}
              >
                {job.title}
              </Link>
              <Chip
                label={t(`job.${job.type.toLowerCase()}`)}
                size="small"
                variant="filled"
                sx={(theme) => ({
                  mt: 0.5,
                  bgcolor:
                    theme.palette.mode === "dark" ? "grey.700" : "grey.300",
                  fontWeight: "bold",
                })}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Tooltip
            title={job.notes}
            disableHoverListener={job.notes.length <= 100} // Approximate check for overflow
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 400,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
            >
              {job.notes}
            </Typography>
          </Tooltip>
        </Stack>
        <Stack direction="row">
          <Stack direction="column" flex={1}>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("job.vacancies")}>
                <PersonOutline fontSize="small" />
              </Tooltip>
              <Typography variant="caption">{job.vacancies}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("job.location")}>
                <LocationOnOutlined fontSize="small" />
              </Tooltip>
              <Typography variant="caption">
                {t(`cities.${job.city}`)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("job.date")}>
                <EventIcon fontSize="small" />
              </Tooltip>
              <Typography variant="caption">{formatWorkShift(job)}</Typography>
            </Stack>
          </Stack>
          <Stack direction="column" flex={1}>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("job.hours")}>
                <AccessTimeOutlinedIcon fontSize="small" />
              </Tooltip>
              <Typography variant="caption">
                {t("time.hour", {
                  count: calculateTotalHours(job),
                })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("job.wage")}>
                <MonetizationOnOutlined fontSize="small" />
              </Tooltip>
              <Typography variant="caption">
                {Intl.NumberFormat(language, {
                  currency: "TWD",
                }).format(job.wage)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" spacing={1}>
          <Typography variant="caption" color="text.secondary">
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
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={
              isSaved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />
            }
            onClick={handleSaveClick}
          >
            {t("job.save")}
          </Button>
          <Button
            variant="contained"
            size="small"
            color={applicationStatus === undefined ? "primary" : "info"}
            onClick={handleApplyClick}
            disabled={applicationStatus !== undefined}
          >
            {applicationStatus === APPLICATION_STATUS_PENDING
              ? t("job.pending")
              : t("job.apply")}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
