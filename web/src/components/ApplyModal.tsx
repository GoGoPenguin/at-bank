import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import type { Job } from "../types/job.type";

interface ApplyModalProps {
  job: Job;
  open: boolean;
  handleClose: (success?: boolean) => void;
}

export default function ApplyModal({
  job,
  open,
  handleClose,
}: ApplyModalProps) {
  const { t } = useTranslation();
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const { applyToJob } = useApi();
  const { handleAlert } = useContext(alertContext);

  const formatShiftTime = (date: Date, startTime: number, endTime: number) => {
    const shiftDate = new Date(date);
    const startHour = Math.floor(startTime / 3600);
    const startMinute = Math.floor((startTime % 3600) / 60);
    const endHour = Math.floor(endTime / 3600);
    const endMinute = Math.floor((endTime % 3600) / 60);

    return `${shiftDate.toLocaleDateString()} ${startHour
      .toString()
      .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")} - ${endHour
      .toString()
      .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
  };

  const handleShiftToggle = (shiftIndex: number) => {
    const indexStr = shiftIndex.toString();
    setSelectedShifts((prev) =>
      prev.includes(indexStr)
        ? prev.filter((id) => id !== indexStr)
        : [...prev, indexStr]
    );
  };

  const handleSubmit = () => {
    const formattedShifts = selectedShifts.map((shiftIndex) => {
      const shift = job.shifts[parseInt(shiftIndex, 10)];
      const shiftDate = new Date(shift.date);
      return shiftDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    });

    applyToJob(job.id, formattedShifts)
      .then(() => {
        handleAlert("appliedSuccessfully", "info");
        handleClose(true);
      })
      .catch(() => {
        handleAlert("networkError", "error");
        handleClose(false);
      })
      .finally(() => {
        setSelectedShifts([]);
      });
  };

  const handleModalClose = () => {
    setSelectedShifts([]);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflow: "auto",
          backgroundColor: "hsl(0, 0%, 100%)",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          {t("modal.apply.title")} - {job.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          {t("modal.apply.selectShifts")}
        </Typography>

        <Box
          sx={{
            maxHeight: "50vh",
            overflow: "auto",
            mb: 3,
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          }}
        >
          <FormGroup sx={{ ml: 1 }}>
            {job.shifts.map((shift, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedShifts.includes(index.toString())}
                    onChange={() => handleShiftToggle(index)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatShiftTime(
                        shift.date,
                        shift.startTime as number,
                        shift.endTime as number
                      )}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={handleModalClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={selectedShifts.length === 0}
          >
            {t("modal.apply.submit")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
