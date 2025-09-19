import { Grid, MenuItem, Select, Typography } from "@mui/material";
import type { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { JOB_TYPES } from "../types/job.type";
import { cities } from "../utils/address.utils";

const Search = ({
  jobType,
  location,
  onChangeJobType,
  onChangeLocation,
}: {
  jobType?: string;
  location?: string;
  onChangeJobType?: (
    event:
      | ChangeEvent<Omit<HTMLInputElement, "value"> & { value: string }>
      | (Event & { target: { value: string; name: string } }),
    child: ReactNode
  ) => void;
  onChangeLocation?: (
    event:
      | ChangeEvent<Omit<HTMLInputElement, "value"> & { value: string }>
      | (Event & { target: { value: string; name: string } }),
    child: ReactNode
  ) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyItems="center"
      direction="row"
    >
      <Typography variant="h2">{t("job.showMe")}</Typography>
      <Select
        sx={(theme) => ({
          minWidth: 200,
          backgroundColor: "white",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid",
          height: "100%",
          fontSize: "1.43rem",
          boxShadow: 0,
          px: 3,
        })}
        displayEmpty
        defaultValue=""
        value={jobType ?? ""}
        onChange={onChangeJobType}
      >
        <MenuItem value="">
          <em>{t("common.any")}</em>
        </MenuItem>
        {JOB_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {t(`job.${type.toLowerCase()}`)}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="h2">{`${t("job.job", { count: 0 })}${t(
        "common.comma"
      )}${t("job.hiringIn")}`}</Typography>

      <Select
        sx={(theme) => ({
          minWidth: 200,
          backgroundColor: "white",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid",
          height: "100%",
          fontSize: "1.43rem",
          boxShadow: 0,
          px: 3,
        })}
        displayEmpty
        defaultValue=""
        value={location ?? ""}
        onChange={onChangeLocation}
      >
        <MenuItem value="">
          <em>{t("common.any")}</em>
        </MenuItem>
        {cities.map((city) => (
          <MenuItem key={city} value={city}>
            {t(`cities.${city}`)}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default Search;
