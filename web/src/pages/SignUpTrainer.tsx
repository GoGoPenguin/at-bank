import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FormHelperText, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as React from "react";
import { useContext } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Logo from "../assets/logo.png";
import CustomDatePicker from "../components/CustomDatePicker";
import ColorModeSelect from "../components/theme/ColorModeSelect";
import AlertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import { EMT_LICENSES } from "../types/emt-licenses.type";
import { USER_TYPE_ATHLETIC_TRAINER, USER_TYPES } from "../types/user.type";

const stepFields = [
  // Step 1 Fields
  ["account", "password", "chineseName", "englishName", "birthday", "id"],
  // Step 2 Fields
  [
    "phone",
    "permanentAddress",
    "correspondenceAddress",
    "email",
    "lineId",
    "postOfficeAccount",
  ],
  // Step 3 Fields
  [
    "emtLicense",
    "emtLicenseValidUntil",
    "tatsLicense",
    "tatsLicenseNumber",
    "tatsLicenseValidUntil",
  ],
] as const;

const formSchema = z
  .object({
    // Hidden
    type: z.enum(USER_TYPES),

    // Step 1
    account: z.string().trim().min(1, "error.required"),
    password: z.string().trim().min(6, "error.passwordMinLength"),
    chineseName: z
      .string()
      .trim()
      .min(1, "error.required")
      .regex(/^[\u4e00-\u9fa5]+$/, "error.invalidChineseName"),
    englishName: z
      .string()
      .trim()
      .min(1, "error.required")
      .regex(/^[A-Za-z\s]+$/, "error.invalidEnglishName"),
    birthday: z.date({ error: "error.required" }).refine(
      (date) => {
        const today = dayjs();
        const birthday = dayjs(date);
        return today.diff(birthday, "year") >= 18;
      },
      { message: "error.mustBeAtLeast18YearsOld" }
    ),
    id: z
      .string()
      .trim()
      .refine(
        (id) => {
          const ID_REGEX = /^[A-Z]{1}[1-2A-D8-9]{1}[0-9]{8}$/;
          const ID_LETTERS = "ABCDEFGHJKLMNPQRSTUVXYWZIO";

          id = id.toUpperCase();
          if (!ID_REGEX.test(id)) {
            return false;
          }

          const letterIndex = ID_LETTERS.indexOf(id[0]);
          let sum = Math.floor(letterIndex / 10 + 1) + letterIndex * 9;

          // Legacy ARC
          if (/[A-Z]/.test(id[1])) {
            sum += (ID_LETTERS.indexOf(id[1]) % 10) * 8;
          } else {
            sum += parseInt(id[1]) * 8;
          }

          for (let i = 2; i < 9; i++) {
            sum += (9 - i) * parseInt(id[i]);
          }
          sum += parseInt(id[9]);

          return sum % 10 === 0;
        },
        { message: "error.invalidId" }
      ),

    // Step 2
    phone: z
      .string()
      .trim()
      .min(1, "error.required")
      .regex(/^(09|\+8869)[0-9]{8}$/, "error.invalidPhoneNumber"),
    permanentAddress: z.string().trim().min(1, "error.required"),
    correspondenceAddress: z.string().trim().min(1, "error.required"),
    email: z.email("error.invalidEmail"),
    lineId: z
      .string()
      .trim()
      .min(1, "error.required")
      .regex(/^[a-z0-9\-_]{2,20}$/, "error.invalidLineId"),
    postOfficeAccount: z
      .string()
      .trim()
      .min(1, "error.required")
      .regex(
        /^(?:7000021\d{7}|7000010\d{1})$/,
        "error.invalidPostOfficeAccount"
      ),

    // Step 3
    emtLicense: z.any(),
    emtLicenseValidUntil: z.date().optional(),
    tatsLicense: z.number(), // Assuming 0 for "none" and 1 for "has"
    tatsLicenseNumber: z.string().trim().optional(),
    tatsLicenseValidUntil: z.date().optional(),
  })
  .refine(
    ({ emtLicense, emtLicenseValidUntil }) => {
      if (!emtLicense) return true;
      return !!emtLicenseValidUntil;
    },
    { message: "error.required", path: ["emtLicenseValidUntil"] }
  )
  .refine(
    ({ tatsLicense, tatsLicenseNumber }) => {
      if (!tatsLicense) return true;
      return !!tatsLicenseNumber;
    },
    {
      message: "error.required",
      path: ["tatsLicenseNumber"],
    }
  )
  .refine(
    ({ tatsLicense, tatsLicenseValidUntil }) => {
      if (!tatsLicense) return true;
      return !!tatsLicenseValidUntil;
    },
    {
      message: "error.required",
      path: ["tatsLicenseValidUntil"],
    }
  );
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
    maxWidth: "650px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignUpTrainer() {
  const { t } = useTranslation();
  const { handleAlert } = useContext(AlertContext);
  const { checkAccountExists, signUp } = useApi();
  const steps = [
    t("signUpTrainer.stepBasicInformation"),
    t("signUpTrainer.stepContactInformation"),
    t("signUpTrainer.stepLicenseInformation"),
  ];
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setError,
    control,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      type: USER_TYPE_ATHLETIC_TRAINER,
      tatsLicense: 0,
      emtLicense: undefined,
    },
  });
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      handleAlert("signUpSuccessful", "success");
      navigate("/sign-in", { replace: true });
    },
  });

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const fieldsToValidate = stepFields[activeStep];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!isValid) return;

    if (activeStep === 0) {
      const accountExists = await checkAccountExists(getValues()["account"]);
      if (accountExists) {
        setError(
          "account",
          {
            message: "error.accountExists",
            type: "server",
          },
          { shouldFocus: true }
        );
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const onSubmit: SubmitHandler<TFormSchema> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <img src={Logo} alt="Logo" width={100} />
        <IconButton aria-label="go back" onClick={handleGoBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 0 && (
            <React.Fragment>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.account")}</FormLabel>
                    <TextField
                      {...register("account")}
                      error={!!errors.account}
                      helperText={t(errors.account?.message || "")}
                      placeholder={t("signUpTrainer.accountPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.password")}</FormLabel>
                    <TextField
                      {...register("password")}
                      type="password"
                      error={!!errors.password}
                      helperText={t(errors.password?.message || "")}
                      placeholder={t("signUpTrainer.passwordPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.chineseName")}</FormLabel>
                    <TextField
                      {...register("chineseName")}
                      error={!!errors.chineseName}
                      helperText={t(errors.chineseName?.message || "")}
                      placeholder={t("signUpTrainer.chineseNamePlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.englishName")}</FormLabel>
                    <TextField
                      {...register("englishName")}
                      error={!!errors.englishName}
                      helperText={t(errors.englishName?.message || "")}
                      placeholder={t("signUpTrainer.englishNamePlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl>
                <FormLabel>{t("signUpTrainer.birthday")}</FormLabel>
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field }) => (
                    <CustomDatePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(v) => {
                        field.onChange(v ? v.toDate() : null);
                      }}
                      onBlur={field.onBlur}
                      maxDate={dayjs().subtract(18, "year")}
                      error={!!errors.birthday}
                      helperText={t(errors.birthday?.message || "")}
                    />
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("signUpTrainer.ID")}</FormLabel>
                <TextField
                  {...register("id")}
                  error={!!errors.id}
                  helperText={t(errors.id?.message || "")}
                  placeholder={t("signUpTrainer.IDPlaceholder")}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </React.Fragment>
          )}
          {activeStep === 1 && (
            <React.Fragment>
              <FormControl>
                <FormLabel>{t("signUpTrainer.phone")}</FormLabel>
                <TextField
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={t(errors.phone?.message || "")}
                  placeholder={t("signUpTrainer.phonePlaceholder")}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("signUpTrainer.permanentAddress")}</FormLabel>
                <TextField
                  {...register("permanentAddress")}
                  error={!!errors.permanentAddress}
                  helperText={t(errors.permanentAddress?.message || "")}
                  placeholder={t("signUpTrainer.permanentAddressPlaceholder")}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {t("signUpTrainer.correspondenceAddress")}
                </FormLabel>
                <TextField
                  {...register("correspondenceAddress")}
                  error={!!errors.correspondenceAddress}
                  helperText={t(errors.correspondenceAddress?.message || "")}
                  placeholder={t(
                    "signUpTrainer.correspondenceAddressPlaceholder"
                  )}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.email")}</FormLabel>
                    <TextField
                      {...register("email")}
                      error={!!errors.email}
                      helperText={t(errors.email?.message || "")}
                      placeholder={t("signUpTrainer.emailPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.lineId")}</FormLabel>
                    <TextField
                      {...register("lineId")}
                      error={!!errors.lineId}
                      helperText={t(errors.lineId?.message || "")}
                      placeholder={t("signUpTrainer.lineIdPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <FormControl>
                <FormLabel>{t("signUpTrainer.postOfficeAccount")}</FormLabel>
                <TextField
                  {...register("postOfficeAccount")}
                  error={!!errors.postOfficeAccount}
                  helperText={t(errors.postOfficeAccount?.message || "")}
                  type="text"
                  placeholder={t("signUpTrainer.postOfficeAccountPlaceholder")}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </React.Fragment>
          )}
          {activeStep === 2 && (
            <React.Fragment>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.emtLicense")}</FormLabel>
                    <Controller
                      name="emtLicense"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          variant="outlined"
                          displayEmpty
                          label="emtLicense"
                          sx={{
                            backgroundColor: "hsl(0, 0%, 99%)",
                            boxShadow: 0,
                          }}
                        >
                          <MenuItem value={undefined}>
                            <em>{t("common.none")}</em>
                          </MenuItem>
                          {EMT_LICENSES.map((license) => (
                            <MenuItem key={license} value={license}>
                              {license}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    ></Controller>
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>
                      {t("signUpTrainer.emtLicenseValidUntil")}
                    </FormLabel>
                    <Controller
                      name="emtLicenseValidUntil"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(v) => {
                            field.onChange(v ? v.toDate() : null);
                          }}
                          onBlur={field.onBlur}
                          error={!!errors.emtLicenseValidUntil}
                          helperText={t(
                            errors.emtLicenseValidUntil?.message || ""
                          )}
                          minDate={dayjs().add(1, "day")}
                        />
                      )}
                    ></Controller>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>{t("signUpTrainer.tatsLicense")}</FormLabel>
                    <Controller
                      control={control}
                      name="tatsLicense"
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            variant="outlined"
                            error={!!errors.tatsLicense}
                            displayEmpty
                            label="tatsLicense"
                            sx={{
                              backgroundColor: "hsl(0, 0%, 99%)",
                              boxShadow: 0,
                            }}
                          >
                            <MenuItem value={0}>
                              <em>{t("common.none")}</em>
                            </MenuItem>
                            <MenuItem value={1}>
                              <em>{t("signUpTrainer.hasTatsLicense")}</em>
                            </MenuItem>
                          </Select>
                          {errors.tatsLicense && (
                            <FormHelperText>
                              {t(errors.tatsLicense?.message || "")}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>
                      {t("signUpTrainer.tatsLicenseNumber")}
                    </FormLabel>
                    <TextField
                      {...register("tatsLicenseNumber")}
                      error={!!errors.tatsLicenseNumber}
                      helperText={t(errors.tatsLicenseNumber?.message || "")}
                      placeholder={t(
                        "signUpTrainer.tatsLicenseNumberPlaceholder"
                      )}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid size="grow">
                  <FormControl fullWidth>
                    <FormLabel>
                      {t("signUpTrainer.tatsLicenseValidUntil")}
                    </FormLabel>
                    <Controller
                      name="tatsLicenseValidUntil"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(v) => {
                            field.onChange(v ? v.toDate() : null);
                          }}
                          onBlur={field.onBlur}
                          error={!!errors.tatsLicenseValidUntil}
                          helperText={t(
                            errors.tatsLicenseValidUntil?.message || ""
                          )}
                          minDate={dayjs().add(1, "day")}
                        />
                      )}
                    ></Controller>
                  </FormControl>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            {activeStep !== 0 && (
              <Button
                size="small"
                color="secondary"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                hidden={activeStep === 0}
              >
                {t("common.back")}
              </Button>
            )}
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                sx={{ mr: 1 }}
                variant="contained"
                size="small"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                {t("signUp.title")}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                size="small"
                variant="contained"
                color="primary"
              >
                {t("common.next")}
              </Button>
            )}
          </Box>
          <Divider>{t("common.or")}</Divider>
          <Typography sx={{ textAlign: "center" }}>
            {t("signUp.alreadyHaveAccount")}{" "}
            <Link href="/sign-in" variant="body2" sx={{ alignSelf: "center" }}>
              {t("signIn.title")}
            </Link>
          </Typography>
        </Box>
      </Card>
    </>
  );
}
