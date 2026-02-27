import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import type { CreateMetricsRequestBody } from "../types/metrics.type";

const RecordDataForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleAlert } = useContext(AlertContext);
  const [hr, setHr] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [rpe, setRpe] = useState<number>(5);
  const { createMetrics } = useApi();

  const mutation = useMutation({
    mutationFn: createMetrics,
    onSuccess: () => {
      handleAlert("createMetricsSuccessful", "success");
      navigate(-1);
    },
  });

  const handleSave = () => {
    const payload: CreateMetricsRequestBody = [];
    if (hr) {
      payload.push({ name: "heart_rate", value: Number(hr), unit: "bpm" });
    }
    if (weight) {
      payload.push({ name: "weight", value: Number(weight), unit: "kg" });
    }
    payload.push({ name: "RPE", value: rpe, unit: "" });

    if (payload.length > 0) {
      mutation.mutate(payload);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Area */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: 4,
          pb: 3,
          px: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("recordDataForm.title")}
        </Typography>
        <IconButton color="inherit" onClick={() => navigate(-1)}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Form Content */}
      <Box sx={{ px: 2.5, flexGrow: 1, pb: 4 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t("recordDataForm.restingHeartRate.label")}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("recordDataForm.restingHeartRate.placeholder")}
              type="number"
              value={hr}
              onChange={(e) => setHr(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {t("recordDataForm.restingHeartRate.unit")}
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t("recordDataForm.bodyWeight.label")}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("recordDataForm.bodyWeight.placeholder")}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {t("recordDataForm.bodyWeight.unit")}
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t("recordDataForm.workoutRPE.label")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("recordDataForm.workoutRPE.description")}
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={rpe}
                onChange={(_e, newValue) => setRpe(newValue as number)}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="on"
                sx={{
                  color:
                    rpe > 7
                      ? "error.main"
                      : rpe > 4
                        ? "secondary.main"
                        : "success.main",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Action Area */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: "background.paper",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={(!hr && !weight && rpe === 5) || mutation.isPending}
          sx={{ py: 1.5, fontSize: "1.1rem" }}
        >
          {mutation.isPending
            ? t("common.loading", "Loading...")
            : t("recordDataForm.button")}
        </Button>
      </Box>
    </Box>
  );
};

export default RecordDataForm;
