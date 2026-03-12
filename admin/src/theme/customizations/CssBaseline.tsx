import { type Components, type Theme } from "@mui/material/styles";

export const CssBaseline: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      body: {
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
      },
    }),
  },
};
