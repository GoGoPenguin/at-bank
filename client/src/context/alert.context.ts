import { type AlertColor } from "@mui/material/Alert";
import React from "react";

// Define the shape of the context's value
export interface AlertContextType {
  open: boolean;
  message: string;
  severity: AlertColor;
  handleClose: () => void;
  handleAlert: (msg: string, sev?: AlertColor) => void;
}

// Create the context with a default value
const AlertContext = React.createContext<AlertContextType>({
  open: false,
  message: "",
  severity: "success",
  handleClose: () => {},
  handleAlert: () => {},
});

export default AlertContext;
