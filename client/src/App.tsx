import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RecordDataForm from "./components/RecordDataForm";
import AlertContext from "./context/alert.context";
import useAlert from "./hooks/use-alert.hook";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const App: React.FC = () => {
  const { t } = useTranslation();
  const { open, message, severity, handleClose, handleAlert } = useAlert();

  return (
    <AlertContext.Provider
      value={{ open, message, severity, handleClose, handleAlert }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* Placeholders for other routes */}
            <Route
              path="history"
              element={<div>{t("app.routes.history")}</div>}
            />
            <Route
              path="trends"
              element={<div>{t("app.routes.trends")}</div>}
            />
            <Route
              path="settings"
              element={<div>{t("app.routes.settings")}</div>}
            />
          </Route>
          <Route path="/log" element={<RecordDataForm />} />
        </Routes>
      </BrowserRouter>
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
};

export default App;
