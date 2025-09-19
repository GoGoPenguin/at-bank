import { type AlertColor } from "@mui/material/Alert";
import { useState } from "react";

const useAlert = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleAlert = (msg: string, sev: AlertColor = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return { open, message, severity, handleClose, handleAlert };
};

export default useAlert;
