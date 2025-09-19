import {
  LocationOnOutlined,
  MonetizationOnOutlined,
  PersonOutline,
} from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import EventIcon from "@mui/icons-material/Event";
import {
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useLanguage from "../hooks/use-language";
import type { Job } from "../types/job.type";
import LetterAvatar from "./LetterAvatar";
export default function JobDiscoveryCard({ job }: { job: Job }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const postedAtDiff = Date.now() - new Date(job.createdAt).getTime();
  const postedAtSeconds = Math.floor(postedAtDiff / 1000);
  const postedAtMinutes = Math.floor(postedAtDiff / 60000);
  const postedAtHours = Math.floor(postedAtDiff / 3600000);
  const postedAtDays = Math.floor(postedAtDiff / 86400000);
  const postedAtMonths = Math.floor(postedAtDiff / 2592000000);
  const postedAtYears = Math.floor(postedAtDiff / 31536000000);

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
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="column">
            <LetterAvatar
              variant="rounded"
              name={job.company}
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
              <Stack direction="column">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: "bold" }}
                  >
                    {job.title}
                  </Typography>
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
                  <Tooltip title={job.notes}>
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
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0, sm: 1 }}
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
                      {t(`cities.${job.location}`)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.date")}>
                      <EventIcon fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {new Date(job.date).toLocaleDateString("en-CA")}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("job.hours")}>
                      <AccessTimeOutlinedIcon fontSize="small" />
                    </Tooltip>
                    <Typography variant="caption">
                      {t("time.hour", { count: job.hours })}
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
                  spacing={1}
                  alignItems="center"
                  sx={{ display: { xs: "none", md: "flex" } }}
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
                    startIcon={<BookmarkBorderOutlinedIcon />}
                  >
                    {t("job.save")}
                  </Button>
                  <Button variant="contained" size="small" color="primary">
                    {t("job.apply")}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" sx={{ display: { xs: "flex", md: "none" } }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {t("job.postedAt", {
                timeAgo: t("time.hour", { count: 2 }),
              })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Stack direction="column" flex={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<BookmarkBorderOutlinedIcon />}
              >
                {t("job.save")}
              </Button>
            </Stack>
            <Stack direction="column" flex={3}>
              <Button variant="contained" size="small" color="primary">
                {t("job.apply")}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
