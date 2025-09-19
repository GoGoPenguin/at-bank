import Public from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import useSwitchLocale, {
  type Language,
} from "../hooks/use-switch-locale.hook";

export default function LanguageSelect() {
  const { switchLocale } = useSwitchLocale();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLanguage = (lang: Language) => () => {
    switchLocale(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        id="frame-color-mode-toggle"
        onClick={handleClick}
        color="primary"
        size="small"
        disableTouchRipple
        aria-controls={open ? "color-scheme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Public />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            sx: {
              my: "4px",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem value="tw" onClick={handleLanguage("tw")}>
          繁體中文
        </MenuItem>
        <MenuItem value="en" onClick={handleLanguage("en")}>
          English
        </MenuItem>
      </Menu>
    </>
  );
}
