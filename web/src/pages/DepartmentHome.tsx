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
import Container from "../components/Container";
import Footer from "../components/Footer";
import JobCard, { type JobPosting } from "../components/JobDashboardCard";
import NavBar from "../components/NavBar";
import StatsCard from "../components/StatsCard";

function DepartmentHome() {
  const mockJobs: JobPosting[] = [
    {
      id: "101",
      title: "Assistant Athletic Trainer",
      status: "Active",
      jobType: "Department",
      applicants: 15,
      needsReview: 4,
      datePosted: new Date(2025, 7, 28),
    },
    {
      id: "102",
      title: "Head AT - Men's Basketball",
      status: "Active",
      jobType: "Individual",
      applicants: 22,
      needsReview: 8,
      datePosted: new Date(2025, 7, 22),
    },
    {
      id: "103",
      title: "Weekend Tournament Coverage",
      status: "Paused",
      jobType: "Tournament",
      applicants: 8,
      needsReview: 0,
      datePosted: new Date(2025, 6, 30),
    },
    {
      id: "104",
      title: "Graduate Assistant Athletic Trainer",
      status: "Closed",
      jobType: "Department",
      applicants: 31,
      needsReview: 0,
      datePosted: new Date(2025, 5, 15),
    },
  ];

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
            Overview
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => alert("Opening new job form...")}
          >
            Post a New Job
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
              title="Active Postings"
              value="2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<HowToRegIcon fontSize="large" />}
              title="Hired"
              value="12"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<PeopleIcon fontSize="large" />}
              title="Total Applicants"
              value="76"
              interval="Last 30 days"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard
              icon={<VisibilityIcon fontSize="large" />}
              title="Total Views"
              value="138"
              interval="Last 30 days"
            />
          </Grid>
        </Grid>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Yours Postings
        </Typography>
        <Grid container spacing={3}>
          {mockJobs.map((job) => (
            <Grid
              key={job.id}
              sx={{
                xs: { span: 12 },
                sm: { span: 6 },
                lg: { span: 4 },
              }}
            >
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
      <Footer></Footer>
    </>
  );
}

export default DepartmentHome;
