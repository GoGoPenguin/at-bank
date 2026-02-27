import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useForkRef } from "@mui/material/utils";
import {
  useParsedFormat,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  type DatePickerFieldProps,
} from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import "dayjs/locale/zh-tw";

type ButtonFieldProps = DatePickerFieldProps & {
  onBlur?: () => void;
};

function ButtonField(props: ButtonFieldProps) {
  const { forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      ref={handleRef}
      onBlur={props.onBlur}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  onBlur,
  helperText,
  error,
  maxDate,
  minDate,
}: {
  label?: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  onBlur?: () => void;
  helperText?: string;
  error?: boolean;
  maxDate?: Dayjs;
  minDate?: Dayjs;
}) {
  return (
    <FormControl error={error} fullWidth>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={onChange}
          slots={{ field: ButtonField }}
          slotProps={{
            nextIconButton: { size: "small" },
            previousIconButton: { size: "small" },
            field: { onBlur },
          }}
          maxDate={maxDate}
          minDate={minDate}
          defaultValue={minDate || maxDate}
        />
      </LocalizationProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
