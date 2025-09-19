import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import PasswordIcon from "@mui/icons-material/Password";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/use-api.hook";
import { useAuthStore } from "../store/use-auth.store";
import {
  USER_TYPE_ATHLETIC_TRAINER,
  type AthleticTrainer,
  type Department,
} from "../types/user.type";
import LetterAvatar from "./LetterAvatar";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearUser, user } = useAuthStore();
  const { signOut } = useApi();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearUser();
      navigate("/sign-in", { replace: true });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <>
      <ButtonBase onClick={handleClick}>
        <LetterAvatar
          name={
            user === undefined
              ? ""
              : user.type === USER_TYPE_ATHLETIC_TRAINER
              ? (user as AthleticTrainer).chineseName
              : (user as Department).departmentName
          }
          sx={{ width: 30, height: 30, fontSize: "0.875rem" }}
        />
      </ButtonBase>
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
        <MenuItem>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography>
            {t("profileMenu.profile")}
          </ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography>
            {t("profileMenu.changePassword")}
          </ListItemText>
        </MenuItem>
        <Divider></Divider>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText disableTypography>
            {t("profileMenu.signOut")}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
