import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Logo from "../assets/logo.png";
import ForgotPassword from "../components/ForgetPassword";
import LanguageSelect from "../components/LanguageSelect";
import useApi from "../hooks/use-api.hook";

const formSchema = z.object({
  account: z.string().min(1, "error.required"),
  password: z.string().min(1, "error.required"),
  rememberMe: z.boolean(),
});
type TFormSchema = z.infer<typeof formSchema>;

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignIn() {
  // const { setUser } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { signIn } = useApi();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      // setUser(data.user);
      navigate("/", { replace: true });
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<TFormSchema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Card variant="outlined">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
          }}
        >
          <img src={Logo} alt="Logo" width={100} height={30} />
          <Box sx={{ flex: "1 1 auto" }} />
          <LanguageSelect />
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("signIn.title")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="account">{t("signIn.account")}</FormLabel>
            <TextField
              {...register("account")}
              error={!!errors.account}
              helperText={t(errors.account?.message || "")}
              placeholder={t("signIn.accountPlaceholder")}
              autoComplete="account"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">{t("signIn.password")}</FormLabel>
            <TextField
              {...register("password")}
              error={!!errors.password}
              helperText={t(errors.password?.message || "")}
              placeholder="••••••"
              type="password"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} color="primary" />}
            label={t("signIn.rememberMe")}
          />
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            fullWidth
          >
            {t("signIn.title")}
          </Button>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            {t("signIn.forgetPassword")}
          </Link>
        </Box>
        <Divider>{t("common.or")}</Divider>
        <Typography sx={{ textAlign: "center" }}>
          {t("signIn.doNotHaveAccount")}{" "}
          <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
            {t("signUp.title")}
          </Link>
        </Typography>
      </Card>
    </>
  );
}
