import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";
import {
  APPLICATION_STATUS_ACCEPTED,
  APPLICATION_STATUS_REJECTED,
} from "../types/job.type";

function DepartmentHome() {
  const { t } = useTranslation();
  const { setUser } = useAuthStore();
  const { getApplications, getMe, updateApplicationStatus } = useApi();
  const { handleAlert } = useContext(alertContext);
  const { data: applications, refetch } = useQuery({
    queryKey: [`applications`],
    queryFn: () => getApplications(),
  });
  const { data: user, isSuccess } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  const handleApprove = async (applicationId: string) => {
    await updateApplicationStatus({
      applicationId,
      status: APPLICATION_STATUS_ACCEPTED,
    });
    handleAlert("applicationStatusUpdated", "success");
    refetch();
  };
  const handleReject = async (applicationId: string) => {
    await updateApplicationStatus({
      applicationId,
      status: APPLICATION_STATUS_REJECTED,
    });
    handleAlert("applicationStatusUpdated", "success");
    refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      setUser(user);
    }
  }, [isSuccess, user, setUser]);

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
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  {t("departmentApplicationRecord.jobTitle")}
                </TableCell>
                <TableCell align="right">
                  {t("departmentApplicationRecord.applicant")}
                </TableCell>
                <TableCell align="right">
                  {t("departmentApplicationRecord.status")}
                </TableCell>
                <TableCell align="right">
                  {t("departmentApplicationRecord.availableSlots")}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {applications?.map((application, index) => (
                <TableRow
                  key={application.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{`#${
                    index + 1
                  }`}</TableCell>
                  <TableCell>{application.job.title}</TableCell>
                  <TableCell align="right">
                    {application.applicant.chineseName}
                  </TableCell>
                  <TableCell align="right">
                    {t(`job.${application.status}`)}
                  </TableCell>
                  <TableCell align="right">{`${application.availableSlots}`}</TableCell>
                  <TableCell>
                    <Stack spacing={1} direction="row">
                      <Button
                        variant="contained"
                        onClick={() => handleApprove(application.id)}
                      >
                        {t("departmentApplicationRecord.approve")}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(application.id)}
                      >
                        {t("departmentApplicationRecord.reject")}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Divider />
      <Footer />
    </>
  );
}

export default DepartmentHome;
