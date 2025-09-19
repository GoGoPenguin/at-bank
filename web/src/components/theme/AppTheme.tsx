import type { ThemeOptions } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as React from "react";
import { CssBaseline } from "../custom/CssBaseline";
import { DataDisplay } from "../custom/DataDisplay";
import { DatePickers } from "../custom/DatePickers";
import { Feedback } from "../custom/Feedback";
import { Input } from "../custom/Inputs";
import { Navigation } from "../custom/Navigation";
import { Surfaces } from "../custom/Surfaces";
import {
  colorSchemes,
  shadows,
  shape,
  typography,
} from "./theme-primitives.constants";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
          typography,
          shadows,
          shape,
          components: {
            ...Input,
            ...DataDisplay,
            ...Feedback,
            ...Navigation,
            ...Surfaces,
            ...DatePickers,
            ...CssBaseline,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
