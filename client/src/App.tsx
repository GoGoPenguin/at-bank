import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import RecordDataForm from "./components/RecordDataForm";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
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
          <Route path="trends" element={<div>{t("app.routes.trends")}</div>} />
          <Route
            path="settings"
            element={<div>{t("app.routes.settings")}</div>}
          />
        </Route>
        <Route path="/log" element={<RecordDataForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
