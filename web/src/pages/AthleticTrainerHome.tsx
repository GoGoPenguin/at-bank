import { Grid, Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import Footer from "../components/Footer";
import JobDiscoveryCard from "../components/JobDiscoveryCard";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import useApi from "../hooks/use-api.hook";
import type { JobType } from "../types/job.type";

function AthleticTrainerHome() {
  const { t } = useTranslation();
  const { getJobs } = useApi();
  const [jobType, setJobType] = useState<JobType | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const {
    data: resp,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`jobs`, { jobType, location, page }],
    queryFn: () => getJobs({ type: jobType, location, page, limit: 10 }),
  });

  const onChangeJobType = (newJobType: JobType | undefined) => {
    setJobType(newJobType);
    setPage(1);
    refetch();
  };
  const onChangeLocation = (newLocation: string | undefined) => {
    setLocation(newLocation);
    setPage(1);
    refetch();
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
        <Container sx={{ pt: { xs: 9, sm: 6 }, pb: { xs: 2, sm: 3 } }}>
          <Search
            jobType={jobType}
            location={location}
            onChangeJobType={(event) =>
              onChangeJobType(
                event.target.value ? (event.target.value as JobType) : undefined
              )
            }
            onChangeLocation={(event) =>
              onChangeLocation(
                event.target.value ? (event.target.value as string) : undefined
              )
            }
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              pb: 3,
              maxWidth: "800px",
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {t("pagination.resultTotal", {
                total: resp?.pagination.totalItems ?? 0,
              })}
            </Typography>
            <Typography variant="subtitle2">
              {t("pagination.pageOf", {
                currentPage: page,
                totalPages: resp?.pagination.totalPages,
              })}
            </Typography>
          </Box>
          {isLoading ? (
            <Grid spacing={2} container>
              <Skeleton variant="rounded" width={800} height={144} />
              <Skeleton variant="rounded" width={800} height={144} />
              <Skeleton variant="rounded" width={800} height={144} />
              <Skeleton variant="rounded" width={800} height={144} />
            </Grid>
          ) : (
            resp?.data?.map((job, index) => (
              <JobDiscoveryCard key={index} job={job} />
            ))
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              pt: 2,
              pb: 3,
              maxWidth: "800px",
            }}
          >
            <Box display={{ xs: "none", md: "flex" }}>
              <Pagination
                page={page}
                onChange={(_, value) => setPage(value)}
                count={resp?.pagination.totalPages ?? 0}
                color="primary"
              />
            </Box>
            <Box display={{ xs: "flex", md: "none" }}>
              <Pagination
                page={page}
                onChange={(_, value) => setPage(value)}
                count={resp?.pagination.totalPages ?? 0}
                color="primary"
                size="small"
              />
            </Box>
          </Box>
        </Container>
      </Box>
      <Divider />
      <Footer />
    </>
  );
}

export default AthleticTrainerHome;
