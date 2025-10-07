import React from "react";

const Home = React.lazy(() => import("./pages/Home"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const SignUpTrainer = React.lazy(() => import("./pages/SignUpTrainer"));
const SignUpDept = React.lazy(() => import("./pages/SignUpDept"));
const JobDetail = React.lazy(() => import("./pages/JobDetail"));

const routes = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/sign-in",
    element: SignIn,
  },
  {
    path: "/sign-up",
    element: SignUp,
  },
  {
    path: "/sign-up/trainer",
    element: SignUpTrainer,
  },
  {
    path: "/sign-up/department",
    element: SignUpDept,
  },
  {
    path: "/job/:id",
    element: JobDetail,
  },
];

export default routes;
