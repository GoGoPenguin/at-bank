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
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ApplyModal from "../components/ApplyModal";
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
  type DepartmentJob,
  type IndividualJob,
  type Job,
  type TournamentJob,
} from "../types/job.type";

function JobDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { id } = useParams();
  const { getJob, saveJob, unsaveJob } = useApi();
  const { handleAlert } = useContext(alertContext);
  const {
    data: job,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getJob", id],
    queryFn: () => getJob(String(id)),
  });
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [applicationStatus, setApplicationStatus] = useState(
    job?.applicationStatus || undefined
  );
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const postedAtDiff = Date.now() - new Date(job?.createdAt ?? "").getTime();
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

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleSaveClick = () => {
    if (job === undefined) return;
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

  const handleCloseApplyModal = (success?: boolean) => {
    setApplyModalOpen(false);
    if (success) {
      setApplicationStatus(APPLICATION_STATUS_PENDING);
    }
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
                      name={job?.departmentName ?? ""}
                      sx={{ width: 48, height: 48 }}
                    ></LetterAvatar>
                    <Typography variant="h6">{job?.departmentName}</Typography>
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
                      onClick={() => {
                        setApplyModalOpen(true);
                      }}
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
                    {t(`cities.${job?.city}`)}
                  </Typography>
                  <Typography variant="body1">
                    {job === undefined ? "" : formatWorkShift(job)}
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
                      {job !== undefined
                        ? `${formatWorkShift(job)} (${t("time.hour", {
                            count: calculateTotalHours(job),
                          })})`
                        : null}
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
              <Grid container spacing={2} mt={2}>
                <Grid size={12}>
                  <Typography variant="h6" fontWeight="bold">
                    {t("job.shifts")}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    {job?.shifts.map((shift, index) => {
                      const date = new Date(shift.date);
                      const formatTime = (seconds: number) => {
                        const hours = Math.floor(seconds / 3600)
                          .toString()
                          .padStart(2, "0");
                        const minutes = Math.floor((seconds % 3600) / 60)
                          .toString()
                          .padStart(2, "0");
                        return `${hours}:${minutes}`;
                      };

                      return (
                        <Typography
                          key={index}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5 }}
                        >
                          {`${date.getFullYear()}/${
                            date.getMonth() + 1
                          }/${date.getDate()} ${formatTime(
                            shift.startTime
                          )} - ${formatTime(shift.endTime)}`}
                        </Typography>
                      );
                    })}
                  </Box>
                </Grid>
                {job?.type === JOB_TYPE_TOURNAMENT ? (
                  <>
                    <Grid size={12}>
                      <Typography variant="h6" fontWeight="bold">
                        {t("job.tournamentName")}
                      </Typography>
                      <Typography variant="body2" whiteSpace="pre-line">
                        {(job as TournamentJob)?.tournamentName}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="h6" fontWeight="bold">
                        {t("job.numberOfTournaments")}
                      </Typography>
                      <Typography variant="body2" whiteSpace="pre-line">
                        {(job as TournamentJob)?.numberOfTournaments}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid size={12}>
                      <Typography variant="h6" fontWeight="bold">
                        {t("job.serviceContent")}
                      </Typography>
                      <Typography variant="body2" whiteSpace="pre-line">
                        {(job as IndividualJob)?.serviceContent ===
                        SERVICE_CONTENT_ATHLETIC_TRAINING
                          ? t("job.athleticTraining")
                          : t("job.massageTherapy")}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid size={12}>
                  <Typography variant="h6" fontWeight="bold">
                    {t("job.notes")}
                  </Typography>
                  <Typography variant="body2" whiteSpace="pre-line">
                    {job?.notes}
                  </Typography>
                </Grid>
              </Grid>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  size="small"
                  color={applicationStatus === undefined ? "primary" : "info"}
                  onClick={() => {
                    setApplyModalOpen(true);
                  }}
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
                    <Typography variant="body2">
                      {(job as IndividualJob)?.contactPerson}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.contactPhone")}
                    </Typography>
                    <Typography variant="body2">
                      {(job as IndividualJob)?.contactPhone}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {t("job.contactEmail")}
                    </Typography>
                    <Typography variant="body2">
                      {(job as IndividualJob)?.contactEmail}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                    <LetterAvatar
                      variant="rounded"
                      name={job?.departmentName ?? ""}
                      sx={{ width: 48, height: 48 }}
                    ></LetterAvatar>
                    <Typography variant="h6">{job?.departmentName}</Typography>
                  </Stack>
                  <Grid container spacing={2} mt={2}>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.companyName")}
                      </Typography>
                      <Typography variant="body2">
                        {job?.departmentName}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.taxId")}
                      </Typography>
                      <Typography variant="body2">
                        {(job as DepartmentJob)?.departmentTaxId}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.head")}
                      </Typography>
                      <Typography variant="body2">
                        {(job as DepartmentJob)?.departmentContactPerson}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.contactPhone")}
                      </Typography>
                      <Typography variant="body2">
                        {(job as DepartmentJob)?.departmentPhone}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body1" fontWeight="bold">
                        {t("job.address")}
                      </Typography>
                      <Typography variant="body2">
                        {`${(job as DepartmentJob)?.departmentCity} ${
                          (job as DepartmentJob)?.departmentDistrict
                        } ${(job as DepartmentJob)?.departmentAddress}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </>
        )}
      </Container>
      {job !== undefined && (
        <ApplyModal
          job={job}
          open={applyModalOpen}
          handleClose={handleCloseApplyModal}
        />
      )}
    </Box>
  );
}

export default JobDetail;
