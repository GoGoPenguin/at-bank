import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import { t } from "i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import Container from "./components/Container";
import AppTheme from "./components/theme/AppTheme";
import AlertContext from "./context/alert.context";
import useAlert from "./hooks/use-alert.hook";
import routes from "./routes";

function App() {
  const { open, message, severity, handleClose, handleAlert } = useAlert();

  return (
    <AlertContext.Provider
      value={{ open, message, severity, handleClose, handleAlert }}
    >
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Container direction="column" justifyContent="space-between">
          <Routes>
            {routes.map((route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={<route.element />}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </AppTheme>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {(() => {
            switch (severity) {
              case "error":
                return t(`alert.error.${message}`) || message;
              case "success":
                return t(`alert.success.${message}`) || message;
              case "warning":
                return t(`alert.warning.${message}`) || message;
              case "info":
                return t(`alert.info.${message}`) || message;
              default:
                return message;
            }
          })()}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}

export default App;
