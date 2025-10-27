import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Button,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";
import {
  type JobApplication,
  APPLICATION_STATUS_ACCEPTED,
  APPLICATION_STATUS_REJECTED,
} from "../types/job.type";

function Row(props: { row: JobApplication }) {
  const { t } = useTranslation();
  const { updateApplicationStatus } = useApi();
  const [open, setOpen] = useState(false);
  const { handleAlert } = useContext(alertContext);

  const handleApprove = async (applicationId: string) => {
    await updateApplicationStatus({
      applicationId,
      status: APPLICATION_STATUS_ACCEPTED,
    });
    handleAlert("applicationStatusUpdated", "success");
    props.row.status = APPLICATION_STATUS_ACCEPTED;
  };
  const handleReject = async (applicationId: string) => {
    await updateApplicationStatus({
      applicationId,
      status: APPLICATION_STATUS_REJECTED,
    });
    handleAlert("applicationStatusUpdated", "success");
    props.row.status = APPLICATION_STATUS_REJECTED;
  };

  return (
    <>
      <TableRow
        key={props.row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              border: "none",
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{props.row.job.title}</TableCell>
        <TableCell align="right">{props.row.applicant.chineseName}</TableCell>
        <TableCell align="right">{t(`job.${props.row.status}`)}</TableCell>
        <TableCell align="right">{`${props.row.availableSlots}`}</TableCell>
        <TableCell>
          {new Date(props.row.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              onClick={() => handleApprove(props.row.id)}
            >
              {t("departmentApplicationRecord.approve")}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleReject(props.row.id)}
            >
              {t("departmentApplicationRecord.reject")}
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ marginLeft: 10, marginTop: 2, marginBottom: 2 }}>
              <Typography variant="caption" gutterBottom component="div">
                {t("departmentApplicationRecord.applicationDetails")}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t("departmentApplicationRecord.phone")}
                    </TableCell>
                    <TableCell>
                      {t("departmentApplicationRecord.email")}
                    </TableCell>
                    <TableCell>
                      {t("departmentApplicationRecord.emtLicense")}
                    </TableCell>
                    <TableCell>
                      {t("departmentApplicationRecord.emtLicenseValidUntil")}
                    </TableCell>
                    <TableCell>
                      {t("departmentApplicationRecord.tatsLicenseNumber")}
                    </TableCell>
                    <TableCell>
                      {t("departmentApplicationRecord.tatsLicenseValidUntil")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={props.row.id}>
                    <TableCell>{props.row.applicant.phone}</TableCell>
                    <TableCell>{props.row.applicant.email}</TableCell>
                    <TableCell>{props.row.applicant.emtLicense}</TableCell>
                    <TableCell>
                      {props.row.applicant.emtLicenseValidUntil
                        ? new Date(
                            props.row.applicant.emtLicenseValidUntil
                          ).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {props.row.applicant.tatsLicenseNumber}
                    </TableCell>
                    <TableCell>
                      {props.row.applicant.tatsLicenseValidUntil
                        ? new Date(
                            props.row.applicant.tatsLicenseValidUntil
                          ).toLocaleDateString()
                        : ""}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ApplicationRecord() {
  const { t } = useTranslation();
  const { setUser } = useAuthStore();
  const { getApplications, getMe } = useApi();
  const { data: applications } = useQuery({
    queryKey: [`applications`],
    queryFn: () => getApplications(),
  });
  const { data: user, isSuccess } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

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
                <TableCell align="right">
                  {t("departmentApplicationRecord.applicationDate")}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {applications?.map((application) => (
                <Row key={application.id} row={application} />
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
