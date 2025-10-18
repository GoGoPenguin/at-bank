import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FormHelperText, Grid, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Logo from "../assets/logo.png";
import Card from "../components/Card";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import { ROLE_DEPARTMENT, ROLES } from "../types/user.type";
import { cities, districts } from "../utils/address.utils";

const formSchema = z.object({
  // Hidden
  role: z.enum(ROLES),

  // Step 1
  account: z
    .string()
    .trim()
    .min(1, "error.required")
    .min(3, "error.accountMinLength")
    .max(32, "error.accountMaxLength")
    .regex(/^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/, "error.invalidAccount"),
  password: z.string().trim().min(6, "error.passwordMinLength"),
  name: z.string().trim().min(1, "error.required"),
  taxId: z
    .string()
    .trim()
    .regex(/^[0-9]{8}$/, "error.taxIdLength"),

  // Step 2
  contactPerson: z.string().trim().min(1, "error.required"),
  phone: z
    .string()
    .trim()
    .min(1, "error.required")
    .regex(/^(09|\+8869)[0-9]{8}$/, "error.invalidPhoneNumber"),
  lineId: z
    .string()
    .trim()
    .min(1, "error.required")
    .regex(/^[a-z0-9\-_]{2,20}$/, "error.invalidLineId"),
  city: z.string().trim().min(1, "error.required"),
  district: z.string().trim().min(1, "error.required"),
  address: z.string().trim().min(1, "error.required"),
});
type TFormSchema = z.infer<typeof formSchema>;

const stepFields = [
  ["account", "password", "name", "taxId"],
  ["contactPerson", "phone", "lineId", "city", "district", "address"],
] as const;

export default function SignUpDept() {
  const { signUp, checkAccountExists } = useApi();
  const { handleAlert } = useContext(alertContext);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const steps = [
    t("signUpDept.stepBasicInformation"),
    t("signUpDept.stepContactInformation"),
  ];
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      role: ROLE_DEPARTMENT,
      city: "",
      district: "",
    },
  });
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      handleAlert("signUpSuccessful", "success");
      navigate("/sign-in", { replace: true });
    },
  });
  const watchedCity = watch("city");
  useEffect(() => {
    setValue("district", "");
  }, [watchedCity, setValue]);

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const fieldsToValidate = stepFields[activeStep];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!isValid) return;

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

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const onSubmit: SubmitHandler<TFormSchema> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Card variant="outlined" width={650}>
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
                  <FormLabel htmlFor="account">
                    {t("signUpDept.account")}
                  </FormLabel>
                  <TextField
                    {...register("account")}
                    error={!!errors.account}
                    helperText={t(errors.account?.message || "")}
                    placeholder={t("signUpDept.accountPlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="password">
                    {t("signUpDept.password")}
                  </FormLabel>
                  <TextField
                    {...register("password")}
                    error={!!errors.password}
                    helperText={t(errors.password?.message || "")}
                    type="password"
                    placeholder={t("signUpDept.passwordPlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="name">
                    {t("signUpDept.departmentName")}
                  </FormLabel>
                  <TextField
                    {...register("name")}
                    error={!!errors.name}
                    helperText={t(errors.name?.message || "")}
                    placeholder={t("signUpDept.departmentNamePlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="taxId">{t("signUpDept.taxId")}</FormLabel>
                  <TextField
                    {...register("taxId")}
                    error={!!errors.taxId}
                    helperText={t(errors.taxId?.message || "")}
                    placeholder={t("signUpDept.taxIdPlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        {activeStep === 1 && (
          <React.Fragment>
            <Grid container spacing={2}>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="contactPerson">
                    {t("signUpDept.contactPerson")}
                  </FormLabel>
                  <TextField
                    {...register("contactPerson")}
                    error={!!errors.contactPerson}
                    helperText={t(errors.contactPerson?.message || "")}
                    placeholder={t("signUpDept.contactPersonPlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="phone">{t("signUpDept.phone")}</FormLabel>
                  <TextField
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={t(errors.phone?.message || "")}
                    placeholder={t("signUpDept.phonePlaceholder")}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <FormControl>
              <FormLabel htmlFor="lineId">{t("signUpDept.lineId")}</FormLabel>
              <TextField
                {...register("lineId")}
                error={!!errors.lineId}
                helperText={t(errors.lineId?.message || "")}
                placeholder={t("signUpDept.lineIdPlaceholder")}
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="city">{t("signUpDept.city")}</FormLabel>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          variant="outlined"
                          error={!!errors.city}
                          displayEmpty
                          sx={{
                            backgroundColor: "hsl(0, 0%, 99%)",
                            boxShadow: 0,
                          }}
                        >
                          {cities.map((city) => (
                            <MenuItem key={city} value={city}>
                              {t(`cities.${city}`)}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.city && (
                          <FormHelperText error>
                            {t(errors.city.message || "")}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  ></Controller>
                </FormControl>
              </Grid>
              <Grid size="grow">
                <FormControl fullWidth>
                  <FormLabel htmlFor="district">
                    {t("signUpDept.district")}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="district"
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          error={!!errors.district}
                          variant="outlined"
                          displayEmpty
                          sx={{
                            backgroundColor: "hsl(0, 0%, 99%)",
                            boxShadow: 0,
                          }}
                          disabled={!watchedCity}
                        >
                          {districts[watchedCity]?.map((district) => (
                            <MenuItem key={district} value={district}>
                              {t(`districts.${watchedCity}.${district}`)}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.district && (
                          <FormHelperText error>
                            {t(errors.district.message || "")}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  ></Controller>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl>
              <FormLabel htmlFor="address">{t("signUpDept.address")}</FormLabel>
              <TextField
                {...register("address")}
                error={!!errors.address}
                helperText={t(errors.address?.message || "")}
                placeholder={t("signUpDept.addressPlaceholder")}
                fullWidth
                variant="outlined"
              />
            </FormControl>
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
  );
}
