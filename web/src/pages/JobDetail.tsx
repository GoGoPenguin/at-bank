import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import LetterAvatar from "../components/LetterAvatar";
import NavBar from "../components/NavBar";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import useLanguage from "../hooks/use-language";
import {
  APPLICATION_STATUS_PENDING,
  JOB_TYPE_INDIVIDUAL,
  JOB_TYPE_TOURNAMENT,
  SERVICE_CONTENT_ATHLETIC_TRAINING,
} from "../types/job.type";

function JobDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { id } = useParams();
  const { getJob } = useApi();
  const { handleAlert } = useContext(alertContext);
  const {
    data: job,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getJob", id],
    queryFn: () => getJob(Number(id)),
  });
  const [isSaved, setIsSaved] = useState(job?.saved || false);
  const [applicationStatus, setApplicationStatus] = useState(
    job?.applicationStatus || undefined
  );
  const postedAtDiff = Date.now() - new Date(job?.createdAt ?? "").getTime();
  const postedAtSeconds = Math.floor(postedAtDiff / 1000);
  const postedAtMinutes = Math.floor(postedAtDiff / 60000);
  const postedAtHours = Math.floor(postedAtDiff / 3600000);
  const postedAtDays = Math.floor(postedAtDiff / 86400000);
  const postedAtMonths = Math.floor(postedAtDiff / 2592000000);
  const postedAtYears = Math.floor(postedAtDiff / 31536000000);

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleApplyClick = () => {
    // TODO: Implement job application logic
    setApplicationStatus(APPLICATION_STATUS_PENDING);
    handleAlert("appliedSuccessfully", "info");
  };
  const handleSaveClick = () => {
    setIsSaved((currentStatus) => !currentStatus);
    // TODO: Implement save job logic
  };

  return (
    <Box
      sx={{
        mx: { lg: 15, xl: 15 },
        mb: { xs: 4, sm: 6, md: 8, lg: 10 },
      }}
    >
      <NavBar />
      <Container sx={{ pt: { xs: 9, sm: 6 }, pb: { xs: 2, sm: 3 } }}>
        {isLoading && isSuccess ? (
          <>
            <Skeleton height={22} />
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={340}
              sx={{ mb: 2, mt: 3 }}
            />
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={340}
              sx={{ mb: 2, mt: 3 }}
            />
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={340}
              sx={{ mb: 2, mt: 3 }}
            />
          </>
        ) : (
          <>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                component="button"
                type="button"
                color="inherit"
                onClick={handleGoBack}
              >
                {t("common.home")}
              </Link>
              <Typography>{job?.title}</Typography>
            </Breadcrumbs>
            <Paper
              variant="outlined"
              sx={{
                mb: 2,
                mt: 3,
                borderRadius: 1,
                backgroundColor: "hsl(0, 0%, 100%)",
              }}
            >
              <Container sx={{ pt: 3, px: 3 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LetterAvatar
                      variant="rounded"
                      name={job?.company ?? ""}
                      sx={{ width: 48, height: 48 }}
                    ></LetterAvatar>
                    <Typography variant="h6">{job?.company}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
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
                      {isSaved ? t("job.saved") : t("job.save")}{" "}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color={
                        applicationStatus === undefined ? "primary" : "info"
                      }
                      onClick={handleApplyClick}
                      disabled={applicationStatus !== undefined}
                    >
                      {applicationStatus === APPLICATION_STATUS_PENDING
                        ? t("job.pending")
                        : t("job.apply")}
                    </Button>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h4">{job?.title}</Typography>
                  <Chip
                    label={t(`job.${job?.type.toLowerCase()}`)}
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
                <Stack
                  direction="row"
                  spacing={1}
                  color="text.primary"
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  <Typography variant="body1">
                    {t(`cities.${job?.location}`)}
                  </Typography>
                  <Typography variant="body1">
                    {new Date(job?.date ?? "").toLocaleDateString("en-CA")}
                  </Typography>
                  <Typography variant="body1">
                    {Intl.NumberFormat(language, {
                      style: "currency",
                      currency: "TWD",
                    }).format(job?.wage ?? 0)}
                  </Typography>
                </Stack>
                <Typography variant="overline" color="text.secondary" mt={1}>
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
              </Container>
              <Divider />
              <Container
                sx={{ py: 2, px: 3, backgroundColor: "hsl(0, 0%, 98%)" }}
              >
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.location")}
                    </Typography>
                    <Typography variant="body2">{job?.address}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.wage")}
                    </Typography>
                    <Typography variant="body2">
                      {`${Intl.NumberFormat(language, {
                        currency: "TWD",
                      }).format(job?.wage ?? 0)} ${t("job.twd")}`}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.timeCommitment")}
                    </Typography>
                    <Typography variant="body2">
                      {`${new Date(job?.startedAt ?? "").toLocaleTimeString(
                        language,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )} - ${new Date(
                        new Date(job?.startedAt ?? "").getTime() +
                          (job?.hours ?? 0) * 3600000
                      ).toLocaleTimeString(language, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} (${t("time.hour", { count: job?.hours })})`}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.vacancies")}
                    </Typography>
                    <Typography variant="body2">{job?.vacancies}</Typography>
                  </Grid>
                </Grid>
              </Container>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 1,
                backgroundColor: "hsl(0, 0%, 100%)",
              }}
            >
              <Typography variant="h4">{t("job.aboutThisJob")}</Typography>
              {job?.type === JOB_TYPE_TOURNAMENT ? (
                <Grid container spacing={2} mt={2}>
                  <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold">
                      {t("job.tournamentName")}
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-line">
                      {job?.tournamentName}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold">
                      {t("job.numberOfTournaments")}
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-line">
                      {job?.numberOfTournaments}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2} mt={2}>
                  <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold">
                      {t("job.serviceContent")}
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-line">
                      {job?.serviceContent === SERVICE_CONTENT_ATHLETIC_TRAINING
                        ? t("job.athleticTraining")
                        : t("job.massageTherapy")}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold">
                      {t("job.notes")}
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-line">
                      {job?.notes}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <Stack direction="row" justifyContent="center" mt={4}>
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
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 1,
                backgroundColor: "hsl(0, 0%, 100%)",
              }}
            >
              <Typography variant="h4">{t("job.aboutThisCompany")}</Typography>
              {job?.type === JOB_TYPE_INDIVIDUAL ? (
                <Grid container spacing={2} mt={2}>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.contact")}
                    </Typography>
                    <Typography variant="body2">{job?.contact}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.contactPhone")}
                    </Typography>
                    <Typography variant="body2">{job?.contactPhone}</Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.contactEmail")}
                    </Typography>
                    <Typography variant="body2">{job?.contactEmail}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                    <LetterAvatar
                      variant="rounded"
                      name={job?.company ?? ""}
                      sx={{ width: 48, height: 48 }}
                    ></LetterAvatar>
                    <Typography variant="h6">{job?.company}</Typography>
                  </Stack>
                  <Grid container spacing={2} mt={2}>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.companyName")}
                      </Typography>
                      <Typography variant="body2">{job?.company}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.taxId")}
                      </Typography>
                      <Typography variant="body2">{job?.taxId}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.head")}
                      </Typography>
                      <Typography variant="body2">{job?.head}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.contactPhone")}
                      </Typography>
                      <Typography variant="body2">
                        {job?.contactPhone}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.address")}
                      </Typography>
                      <Typography variant="body2">
                        {job?.companyAddress}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
}

export default JobDetail;
