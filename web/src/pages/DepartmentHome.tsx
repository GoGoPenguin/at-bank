import Add from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Work from "@mui/icons-material/Work";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import Footer from "../components/Footer";
import JobDashboardCard from "../components/JobDashboardCard";
import NavBar from "../components/NavBar";
import PostJobModal from "../components/PostJobModal";
import StatsCard from "../components/StatsCard";
import useApi from "../hooks/use-api.hook";

function DepartmentHome() {
  const { t } = useTranslation();
  const { getJobs } = useApi();
  const [isModalOpen, setModalOpen] = useState(false);
  const page = 1;
  const { data: jobs, refetch } = useQuery({
    queryKey: [`jobs`, { page }],
    queryFn: () => getJobs({ page, size: 10 }),
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    refetch();
    setModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          mx: { lg: 15, xl: 15 },
          mb: { xs: 4, sm: 6, md: 8, lg: 10 },
        }}
      >
        <NavBar />
        <Container
          sx={{
            alignItems: "center",
            pt: { xs: 9, sm: 6 },
            pb: { xs: 2, sm: 3 },
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Typography variant="h4" component="h1">
            {t("departmentDashboard.overview")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenModal}
          >
            {t("departmentDashboard.postANewJob")}
          </Button>
        </Stack>
        <Grid
          container
          spacing={2}
          columns={12}
          sx={{ mb: (theme) => theme.spacing(2) }}
        >
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<Work fontSize="large" sx={{ font: "white" }} />}
              title={t("departmentDashboard.activeJobs")}
              value="2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<HowToRegIcon fontSize="large" />}
              title={t("departmentDashboard.hired")}
              value="12"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<PeopleIcon fontSize="large" />}
              title={t("departmentDashboard.totalApplicants")}
              value="76"
              interval={t("departmentDashboard.lastDay", { count: 30 })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<VisibilityIcon fontSize="large" />}
              title={t("departmentDashboard.totalViews")}
              value="138"
              interval={t("departmentDashboard.lastDay", { count: 30 })}
            />
          </Grid>
        </Grid>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {t("departmentDashboard.yoursPostings")}
        </Typography>
        <Grid container spacing={3} justifyContent="flex-start">
          {jobs?.data.map((job) => (
            <Box
              key={job.id}
              sx={{
                xs: { span: 12 },
                sm: { span: 6 },
                lg: { span: 4 },
              }}
            >
              <JobDashboardCard job={job} />
            </Box>
          ))}
        </Grid>
      </Box>
      <Divider />
      <Footer />
      <PostJobModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default DepartmentHome;
