import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { camelize } from "humps";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import alertContext from "../context/alert.context";
import useApi from "../hooks/use-api.hook";
import {
  JOB_TYPE_DEPARTMENT,
  JOB_TYPE_INDIVIDUAL,
  JOB_TYPE_TOURNAMENT,
  JOB_TYPES,
  SERVICE_CONTENTS,
  SUPPLIES_ARRANGEMENTS,
  SUPPLIES_DAIGOU,
} from "../types/job.type";
import { cities, districts } from "../utils/address.utils";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import NumberInput from "./NumberInput";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "80vh",
  maxWidth: "90vw",
  overflowY: "auto",
  backgroundColor: "hsl(0, 0%, 100%)",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  "& em": { color: "hsl(0, 0%, 60%)", fontStyle: "normal" },
};

interface PostJobModalProps {
  open: boolean;
  onClose: () => void;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { createJob, getEquipments } = useApi();
  const [tabValue, setTabValue] = useState("1");
  const [shifts, setShifts] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const { handleAlert } = useContext(alertContext);
  const formSchema = useMemo(
    () =>
      z
        .object({
          type: z.enum(JOB_TYPES),

          // common fields
          title: z
            .string({ error: "error.required" })
            .trim()
            .min(1, "error.required"),
          notes: z.string().trim(),
          wage: z.number({ error: "error.required" }).gt(0, "error.required"),
          vacancies: z
            .number({ error: "error.required" })
            .gt(0, "error.required"),
          shifts: z.array(
            z.object({
              date: z.date({ error: "error.required" }),
              startTime: z.date({ error: "error.required" }),
              endTime: z.date({ error: "error.required" }),
            })
          ),

          // Individual specific fields
          contactPerson: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required"),
          contactPersonBirthday: z
            .date()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required"),
          contactPhone: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required")
            .refine((value) => {
              if (tabValue !== "1") return true;
              return value && /^(09|\+8869)[0-9]{8}$/.test(value);
            }, "error.invalidPhoneNumber"),
          contactEmail: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required")
            .refine((value) => {
              if (tabValue !== "1") return true;
              return (
                value &&
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
              );
            }, "error.invalidEmail"),
          city: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required"),
          district: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required"),
          address: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "1", "error.required"),

          // Department & Individual specific fields
          serviceContent: z.enum(SERVICE_CONTENTS).optional(),

          // Tournament specific fields
          tournamentName: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          numberOfTournaments: z
            .number()
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          tournamentCity: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          tournamentDistrict: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          tournamentAddress: z
            .string()
            .trim()
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          suppliesArrangement: z
            .enum(SUPPLIES_ARRANGEMENTS)
            .optional()
            .refine((value) => !!value || tabValue !== "3", "error.required"),
          suppliesDaigouBudget: z.number().optional(),
          equipmentRentals: z.array(z.string()).optional(),
        })
        .refine(
          ({ suppliesArrangement, suppliesDaigouBudget }) => {
            return !(
              tabValue === "3" &&
              suppliesArrangement === SUPPLIES_DAIGOU &&
              (suppliesDaigouBudget === undefined || suppliesDaigouBudget <= 0)
            );
          },
          {
            message: "error.required",
            path: ["suppliesDaigouBudget"],
          }
        ),
    [tabValue]
  );
  type TFormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<TFormSchema>({
    resolver: useMemo(() => zodResolver(formSchema), [formSchema]),
    mode: "onBlur",
    defaultValues: {
      type: JOB_TYPE_INDIVIDUAL,
      shifts: [],
      equipmentRentals: [],
    },
  });
  const { data: equipments, isLoading } = useQuery({
    queryKey: [`equipments`],
    queryFn: () => getEquipments(),
  });
  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      handleAlert("jobPostedSuccessfully", "success");
      onClose();
    },
  });

  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const watchedSuppliesArrangement = watch("suppliesArrangement");
  const watchedEquipmentRentals = watch("equipmentRentals");
  const watchedCity = watch("city");
  const watchedTournamentCity = watch("tournamentCity");
  const watchedShifts = watch("shifts");
  const watchedWage = watch("wage");
  const watchedVacancies = watch("vacancies");

  const onSubmit: SubmitHandler<TFormSchema> = (data) => {
    mutation.mutate(data);
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const handleAddShift = () => {
    setShifts((shifts) => shifts + 1);
  };
  const handleRemoveShift = () => {
    if (shifts > 1) {
      setShifts((shifts) => shifts - 1);
    }
  };

  useEffect(() => {
    clearErrors();
    reset();
    setTabValue("1");
  }, [open, clearErrors, reset]);
  useEffect(() => {
    setValue("tournamentDistrict", "");
  }, [watchedTournamentCity, setValue]);
  useEffect(() => {
    setValue("district", "");
  }, [watchedCity, setValue]);
  useEffect(() => {
    if (tabValue === "1") {
      setValue("type", JOB_TYPE_INDIVIDUAL);
    } else if (tabValue === "2") {
      setValue("type", JOB_TYPE_DEPARTMENT);
    } else if (tabValue === "3") {
      setValue("type", JOB_TYPE_TOURNAMENT);
    }

    setValue("contactPerson", undefined);
    setValue("contactPersonBirthday", undefined);
    setValue("contactPhone", undefined);
    setValue("contactEmail", undefined);
    setValue("city", undefined);
    setValue("district", undefined);
    setValue("address", undefined);
    setValue("serviceContent", undefined);
    setValue("tournamentName", undefined);
    setValue("numberOfTournaments", undefined);
    setValue("tournamentCity", undefined);
    setValue("tournamentDistrict", undefined);
    setValue("tournamentAddress", undefined);
    setValue("suppliesArrangement", undefined);
    setValue("suppliesDaigouBudget", undefined);
    setValue("equipmentRentals", []);
    clearErrors();
  }, [tabValue, setTabValue, setValue, clearErrors]);
  useEffect(() => {
    const totalMilliseconds = watchedShifts.reduce((acc: number, shift) => {
      const startMs = shift.startTime ? shift.startTime.getTime() : 0;
      const endMs = shift.endTime ? shift.endTime.getTime() : 0;
      const shiftMs = Math.max(0, endMs - startMs);
      return acc + shiftMs;
    }, 0);
    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    const totalCost = totalHours * watchedWage * watchedVacancies || 0;

    const equipmentCost =
      equipments
        ?.filter((equipment) => watchedEquipmentRentals?.includes(equipment.id))
        .reduce((acc, equipment) => {
          const equipmentCost = equipment.pricePerDay * shifts;
          return acc + equipmentCost;
        }, 0) || 0;
    setEstimatedCost((totalCost + equipmentCost) * 1.1);
  }, [
    shifts,
    watchedShifts,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(watchedShifts),
    watchedWage,
    watchedVacancies,
    equipments,
    watchedEquipmentRentals,
  ]);

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="post-job-modal-title"
    >
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography id="post-job-modal-title" variant="h6" component="h2">
            {t("modal.postJob.title")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ backgroundColor: "transparent", border: "none" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <FormLabel>{t("modal.postJob.jobTitle")}</FormLabel>
            <TextField
              {...register("title")}
              error={!!errors.title}
              helperText={t(errors.title?.message || "")}
              placeholder={t("modal.postJob.jobTitlePlaceholder")}
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t("modal.postJob.jobDescription")}</FormLabel>
            <TextField
              {...register("notes")}
              error={!!errors.notes}
              helperText={t(errors.notes?.message || "")}
              placeholder={t("modal.postJob.jobDescriptionPlaceholder")}
              fullWidth
              multiline
              rows={4}
              variant="filled"
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t("modal.postJob.jobWage")}</FormLabel>
            <Controller
              name="wage"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  placeholder={t("modal.postJob.jobWagePlaceholder")}
                  error={!!error?.message}
                  helperText={t(error?.message || "")}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t("modal.postJob.jobVacancies")}</FormLabel>
            <Controller
              name="vacancies"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  placeholder={t("modal.postJob.jobVacanciesPlaceholder")}
                  error={!!error?.message}
                  helperText={t(error?.message || "")}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t("modal.postJob.jobShifts")}</FormLabel>
            {(() => {
              const nodes: JSX.Element[] = [];
              for (let index = 0; index < shifts; index++) {
                nodes.push(
                  <Stack
                    key={index}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 0, sm: 2 }}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    {isXs && (
                      <Typography variant="caption">{`#${
                        index + 1
                      }`}</Typography>
                    )}
                    <Controller
                      control={control}
                      name={`shifts.${index}.date`}
                      render={({ field }) => (
                        <CustomDatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(v) => {
                            field.onChange(v ? v.toDate() : null);
                          }}
                          onBlur={field.onBlur}
                          label={
                            isXs
                              ? t("modal.postJob.shiftDate")
                              : index === 0
                              ? t("modal.postJob.shiftDate")
                              : ""
                          }
                          error={!!errors.shifts?.[index]?.date}
                          helperText={t(
                            errors.shifts?.[index]?.date?.message || ""
                          )}
                          minDate={
                            watchedShifts?.[index - 1]?.date
                              ? dayjs(watchedShifts[index - 1].date).add(
                                  1,
                                  "day"
                                )
                              : dayjs().startOf("day").add(1, "day")
                          }
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`shifts.${index}.startTime`}
                      render={({ field }) => (
                        <CustomTimePicker
                          label={
                            isXs
                              ? t("modal.postJob.shiftStartTime")
                              : index === 0
                              ? t("modal.postJob.shiftStartTime")
                              : ""
                          }
                          value={field.value ? dayjs(field.value) : null}
                          error={!!errors.shifts?.[index]?.startTime}
                          helperText={t(
                            errors.shifts?.[index]?.startTime?.message || ""
                          )}
                          onChange={(v) => {
                            field.onChange(v ? v.toDate() : null);
                          }}
                          maxTime={
                            watchedShifts?.[index]?.endTime
                              ? dayjs(watchedShifts[index].endTime).subtract(
                                  1,
                                  "minute"
                                )
                              : undefined
                          }
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`shifts.${index}.endTime`}
                      render={({ field }) => (
                        <CustomTimePicker
                          label={
                            isXs
                              ? t("modal.postJob.shiftEndTime")
                              : index === 0
                              ? t("modal.postJob.shiftEndTime")
                              : ""
                          }
                          value={field.value ? dayjs(field.value) : null}
                          error={!!errors.shifts?.[index]?.endTime}
                          helperText={t(
                            errors.shifts?.[index]?.endTime?.message || ""
                          )}
                          onChange={(v) => {
                            field.onChange(v ? v.toDate() : null);
                          }}
                          minTime={
                            watchedShifts?.[index]?.startTime
                              ? dayjs(watchedShifts[index].startTime).add(
                                  1,
                                  "minute"
                                )
                              : undefined
                          }
                        />
                      )}
                    />
                  </Stack>
                );
              }
              return nodes;
            })()}
            <Stack direction="row" spacing={2}>
              <Button onClick={handleAddShift} variant="contained" fullWidth>
                {t("modal.postJob.addShift")}
              </Button>
              <Button
                onClick={handleRemoveShift}
                variant="outlined"
                fullWidth
                color="error"
                disabled={shifts <= 1}
              >
                {t("modal.postJob.removeShift")}
              </Button>
            </Stack>
          </FormControl>
          <Box sx={{ width: "100%" }}>
            <FormLabel>{t("modal.postJob.jobType")}</FormLabel>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleTabChange}>
                  <Tab label={t("job.individual")} value="1" />
                  <Tab label={t("job.department")} value="2" />
                  <Tab label={t("job.tournament")} value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
                      <FormLabel>{t("modal.postJob.contactPerson")}</FormLabel>
                      <TextField
                        {...register("contactPerson")}
                        error={!!errors.contactPerson}
                        helperText={t(errors.contactPerson?.message || "")}
                        placeholder={t(
                          "modal.postJob.contactPersonPlaceholder"
                        )}
                        fullWidth
                        variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <FormLabel>
                        {t("modal.postJob.contactPersonBirthday")}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="contactPersonBirthday"
                        render={({ field }) => (
                          <CustomDatePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(v) => {
                              field.onChange(v ? v.toDate() : null);
                            }}
                            onBlur={field.onBlur}
                            maxDate={dayjs().subtract(18, "year")}
                            error={!!errors.contactPersonBirthday}
                            helperText={t(
                              errors.contactPersonBirthday?.message || ""
                            )}
                          />
                        )}
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
                      <FormLabel>{t("modal.postJob.contactPhone")}</FormLabel>
                      <TextField
                        {...register("contactPhone")}
                        error={!!errors.contactPhone}
                        helperText={t(errors.contactPhone?.message || "")}
                        placeholder={t("modal.postJob.contactPhonePlaceholder")}
                        fullWidth
                        variant="outlined"
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <FormLabel>{t("modal.postJob.contactEmail")}</FormLabel>
                      <TextField
                        {...register("contactEmail")}
                        error={!!errors.contactEmail}
                        helperText={t(errors.contactEmail?.message || "")}
                        placeholder={t("modal.postJob.contactEmailPlaceholder")}
                        fullWidth
                        variant="outlined"
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="city">
                        {t("modal.postJob.city")}
                      </FormLabel>
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
                              renderValue={(selected) =>
                                !selected ? (
                                  <em>{t("modal.postJob.cityPlaceholder")} </em>
                                ) : (
                                  t(`cities.${selected}`)
                                )
                              }
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
                    <FormControl fullWidth>
                      <FormLabel htmlFor="district">
                        {t("modal.postJob.district")}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="district"
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              variant="outlined"
                              error={!!errors.district}
                              displayEmpty
                              sx={{
                                backgroundColor: "hsl(0, 0%, 99%)",
                                boxShadow: 0,
                              }}
                              disabled={!watchedCity}
                              renderValue={(selected) =>
                                !selected ? (
                                  <em>
                                    {t("modal.postJob.districtPlaceholder")}
                                  </em>
                                ) : (
                                  t(`districts.${watchedCity}.${selected}`)
                                )
                              }
                            >
                              {districts[watchedCity ?? ""]?.map((district) => (
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
                  </Stack>
                  <FormControl fullWidth>
                    <FormLabel>{t("modal.postJob.address")}</FormLabel>
                    <TextField
                      {...register("address")}
                      error={!!errors.address}
                      helperText={t(errors.address?.message || "")}
                      placeholder={t("modal.postJob.addressPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="serviceContent">
                      {t("modal.postJob.serviceContent")}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="serviceContent"
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            variant="outlined"
                            error={!!errors.serviceContent}
                            displayEmpty
                            sx={{
                              backgroundColor: "hsl(0, 0%, 99%)",
                              boxShadow: 0,
                            }}
                            renderValue={(selected) =>
                              !selected ? (
                                <em>
                                  {t("modal.postJob.serviceContentPlaceholder")}
                                </em>
                              ) : (
                                t(`job.serviceContents.${camelize(selected)}`)
                              )
                            }
                          >
                            {SERVICE_CONTENTS.map((serviceContent) => (
                              <MenuItem
                                key={serviceContent}
                                value={serviceContent}
                              >
                                {t(
                                  `job.serviceContents.${camelize(
                                    serviceContent
                                  )}`
                                )}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.serviceContent && (
                            <FormHelperText error>
                              {t(errors.serviceContent.message || "")}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    ></Controller>
                  </FormControl>
                </Stack>
              </TabPanel>
              <TabPanel value="2">
                <FormControl fullWidth>
                  <FormLabel htmlFor="serviceContent">
                    {t("modal.postJob.serviceContent")}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="serviceContent"
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          variant="outlined"
                          error={!!errors.serviceContent}
                          displayEmpty
                          sx={{
                            backgroundColor: "hsl(0, 0%, 99%)",
                            boxShadow: 0,
                          }}
                          renderValue={(selected) =>
                            !selected ? (
                              <em>
                                {t("modal.postJob.serviceContentPlaceholder")}
                              </em>
                            ) : (
                              t(`job.serviceContents.${camelize(selected)}`)
                            )
                          }
                        >
                          {SERVICE_CONTENTS.map((serviceContent) => (
                            <MenuItem
                              key={serviceContent}
                              value={serviceContent}
                            >
                              {t(
                                `job.serviceContents.${camelize(
                                  serviceContent
                                )}`
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.serviceContent && (
                          <FormHelperText error>
                            {t(errors.serviceContent.message || "")}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  ></Controller>
                </FormControl>
              </TabPanel>
              <TabPanel value="3">
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <FormLabel>{t("modal.postJob.tournamentName")}</FormLabel>
                    <TextField
                      {...register("tournamentName")}
                      error={!!errors.tournamentName}
                      helperText={t(errors.tournamentName?.message || "")}
                      placeholder={t("modal.postJob.tournamentNamePlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel>
                      {t("modal.postJob.numberOfTournaments")}
                    </FormLabel>
                    <Controller
                      name="numberOfTournaments"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <NumberInput
                          {...field}
                          placeholder={t(
                            "modal.postJob.numberOfTournamentsPlaceholder"
                          )}
                          error={!!error?.message}
                          helperText={t(error?.message || "")}
                        />
                      )}
                    />
                  </FormControl>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="tournamentCity">
                        {t("modal.postJob.city")}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="tournamentCity"
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              variant="outlined"
                              error={!!errors.tournamentCity}
                              displayEmpty
                              sx={{
                                backgroundColor: "hsl(0, 0%, 99%)",
                                boxShadow: 0,
                              }}
                              renderValue={(selected) =>
                                !selected ? (
                                  <em>{t("modal.postJob.cityPlaceholder")} </em>
                                ) : (
                                  t(`cities.${selected}`)
                                )
                              }
                            >
                              {cities.map((city) => (
                                <MenuItem key={city} value={city}>
                                  {t(`cities.${city}`)}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.tournamentCity && (
                              <FormHelperText error>
                                {t(errors.tournamentCity.message || "")}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      ></Controller>
                    </FormControl>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="district">
                        {t("modal.postJob.district")}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="tournamentDistrict"
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              variant="outlined"
                              error={!!errors.tournamentDistrict}
                              displayEmpty
                              sx={{
                                backgroundColor: "hsl(0, 0%, 99%)",
                                boxShadow: 0,
                              }}
                              disabled={!watchedTournamentCity}
                              renderValue={(selected) =>
                                !selected ? (
                                  <em>
                                    {t("modal.postJob.districtPlaceholder")}
                                  </em>
                                ) : (
                                  t(
                                    `districts.${watchedTournamentCity}.${selected}`
                                  )
                                )
                              }
                            >
                              {districts[watchedTournamentCity ?? ""]?.map(
                                (district) => (
                                  <MenuItem key={district} value={district}>
                                    {t(
                                      `districts.${watchedTournamentCity}.${district}`
                                    )}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {errors.tournamentCity && (
                              <FormHelperText error>
                                {t(errors.tournamentCity.message || "")}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      ></Controller>
                    </FormControl>
                  </Stack>
                  <FormControl fullWidth>
                    <FormLabel>{t("modal.postJob.address")}</FormLabel>
                    <TextField
                      {...register("tournamentAddress")}
                      error={!!errors.tournamentAddress}
                      helperText={t(errors.tournamentAddress?.message || "")}
                      placeholder={t("modal.postJob.addressPlaceholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="tournamentSupplies">
                        {t("modal.postJob.tournamentSupplies")}
                      </FormLabel>
                      <Controller
                        control={control}
                        name="suppliesArrangement"
                        render={({ field }) => (
                          <>
                            <Select
                              {...field}
                              value={field.value || ""}
                              variant="outlined"
                              error={!!errors.suppliesArrangement}
                              displayEmpty
                              sx={{
                                backgroundColor: "hsl(0, 0%, 99%)",
                                boxShadow: 0,
                              }}
                              renderValue={(selected) =>
                                !selected ? (
                                  <em>
                                    {t(
                                      "modal.postJob.tournamentSuppliesPlaceholder"
                                    )}
                                  </em>
                                ) : (
                                  t(
                                    `job.suppliesArrangement.${camelize(
                                      selected
                                    )}`
                                  )
                                )
                              }
                            >
                              {SUPPLIES_ARRANGEMENTS.map((supply) => (
                                <MenuItem key={supply} value={supply}>
                                  {t(
                                    `job.suppliesArrangement.${camelize(
                                      supply
                                    )}`
                                  )}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.suppliesArrangement && (
                              <FormHelperText error>
                                {t(errors.suppliesArrangement.message || "")}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      ></Controller>
                    </FormControl>
                    <FormControl fullWidth>
                      <FormLabel>
                        {t("modal.postJob.tournamentSuppliesBudget")}
                      </FormLabel>
                      <Controller
                        name="suppliesDaigouBudget"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <NumberInput
                            {...field}
                            placeholder={t(
                              "modal.postJob.tournamentSuppliesBudgetPlaceholder"
                            )}
                            error={!!error?.message}
                            helperText={t(error?.message || "")}
                            disabled={
                              watchedSuppliesArrangement !== SUPPLIES_DAIGOU
                            }
                          />
                        )}
                      />
                    </FormControl>
                  </Stack>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="tournamentEquipment">
                      {t("modal.postJob.tournamentEquipment")}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="equipmentRentals"
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            variant="outlined"
                            error={!!errors.equipmentRentals}
                            displayEmpty
                            sx={{
                              backgroundColor: "hsl(0, 0%, 99%)",
                              boxShadow: 0,
                            }}
                            multiple
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return (
                                  <em>
                                    {t(
                                      "modal.postJob.tournamentEquipmentPlaceholder"
                                    )}
                                  </em>
                                );
                              }
                              return equipments
                                ?.filter((equipment) =>
                                  selected.includes(equipment.id)
                                )
                                .map((equipment) => equipment.name)
                                .join(", ");
                            }}
                            disabled={isLoading}
                          >
                            {equipments?.map((equipment) => (
                              <MenuItem key={equipment.id} value={equipment.id}>
                                <Checkbox
                                  checked={watchedEquipmentRentals?.includes(
                                    equipment.id
                                  )}
                                />
                                <ListItemText
                                  primary={`${equipment.name} (${t(
                                    "money.pricePerDay",
                                    { price: equipment.pricePerDay }
                                  )})${
                                    equipment.notes
                                      ? ` | ${equipment.notes}`
                                      : ""
                                  }`}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.equipmentRentals && (
                            <FormHelperText error>
                              {t(errors.equipmentRentals.message || "")}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    ></Controller>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabContext>
          </Box>
          <Typography variant="h6">{`${t("modal.postJob.estimatedCost")}${t(
            "common.colon"
          )}${estimatedCost.toFixed(0)} ${t("job.twd")}`}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button fullWidth variant="outlined" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              {t("modal.postJob.submit")}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default PostJobModal;
