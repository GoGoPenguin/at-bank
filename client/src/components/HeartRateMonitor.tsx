import FavoriteIcon from "@mui/icons-material/Favorite";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHeartRate } from "../hooks/use-heart-rate";

const HeartRateMonitor: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    isMeasuring,
    bpm,
    progress,
    waveform,
    error,
    startMeasuring,
    stopMeasuring,
    videoRef,
    canvasRef,
  } = useHeartRate();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopMeasuring();
    };
  }, [stopMeasuring]);

  return (
    <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
      >
        {t("heartRate.title", { defaultValue: "Heart Rate Monitor" })}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
        {t("heartRate.instructions", {
          defaultValue:
            "Place your finger firmly over the back camera lens and flash to start measuring.",
        })}
      </Typography>

      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Hidden elements for processing */}
          <video ref={videoRef} style={{ display: "none" }} playsInline muted />
          <canvas
            ref={canvasRef}
            width={64}
            height={64}
            style={{ display: "none" }}
          />

          <Box
            sx={{
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[50],
              position: "relative",
            }}
          >
            {isMeasuring ? (
              <Box sx={{ width: "100%", height: "100%" }}>
                <LineChart
                  xAxis={[
                    {
                      data: Array.from({ length: 50 }, (_, i) => i),
                      position: "none",
                    },
                  ]}
                  yAxis={[{ position: "none" }]}
                  series={[
                    {
                      data: waveform,
                      area: true,
                      color: theme.palette.error.main,
                      showMark: false,
                    },
                  ]}
                  height={200}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  slots={{
                    line: (props) => <path {...props} strokeWidth={3} />,
                  }}
                  sx={{
                    "& .MuiAreaElement-root": {
                      fill: `linear-gradient(to bottom, ${theme.palette.error.main}, transparent)`,
                      opacity: 0.2,
                    },
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  color: theme.palette.text.secondary,
                }}
              >
                <VideocamIcon sx={{ fontSize: 60, mb: 1, opacity: 0.3 }} />
                <Typography>
                  {t("heartRate.waiting", { defaultValue: "Ready to start" })}
                </Typography>
              </Box>
            )}

            {isMeasuring && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                }}
              >
                <FavoriteIcon
                  sx={{
                    color: theme.palette.error.main,
                    fontSize: 20,
                    mr: 0.5,
                    animation: bpm > 0 ? `pulse ${60 / bpm}s infinite` : "none",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.3)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", minWidth: 40 }}
                >
                  {bpm || "--"}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        <Box sx={{ p: 4, backgroundColor: "#fff" }}>
          <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={120}
              thickness={4}
              sx={{ color: theme.palette.primary.main }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h3"
                component="div"
                color="text.primary"
                sx={{ fontWeight: "bold" }}
              >
                {bpm || "--"}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                BPM
              </Typography>
            </Box>
          </Box>

          <Box>
            {!isMeasuring ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<VideocamIcon />}
                onClick={startMeasuring}
                sx={{
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  boxShadow: theme.shadows[4],
                }}
              >
                {t("heartRate.start", { defaultValue: "Start Measurement" })}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<VideocamOffIcon />}
                onClick={stopMeasuring}
                sx={{
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                {t("heartRate.stop", { defaultValue: "Stop" })}
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          textAlign: "left",
          p: 3,
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          {t("heartRate.tips.title", { defaultValue: "Tips for accuracy:" })}
        </Typography>
        <ul
          style={{
            paddingLeft: 20,
            marginTop: 4,
            fontSize: "0.875rem",
            opacity: 0.8,
          }}
        >
          <li>
            {t("heartRate.tips.1", {
              defaultValue: "Keep your hand steady and relaxed.",
            })}
          </li>
          <li>
            {t("heartRate.tips.2", {
              defaultValue: "Cover the entire camera lens with your finger.",
            })}
          </li>
          <li>
            {t("heartRate.tips.3", {
              defaultValue:
                "Avoid pressing too hard, as it can restrict blood flow.",
            })}
          </li>
          <li>
            {t("heartRate.tips.4", {
              defaultValue:
                "Ensure you are in a well-lit environment if no flash is available.",
            })}
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default HeartRateMonitor;
