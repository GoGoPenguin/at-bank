import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useForkRef } from "@mui/material/utils";
import {
  TimePicker,
  useParsedFormat,
  usePickerContext,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type DatePickerFieldProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import "dayjs/locale/zh-tw";

type ButtonFieldProps = DatePickerFieldProps & {
  onBlur?: () => void;
};

function ButtonField(props: ButtonFieldProps) {
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();
  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      variant="outlined"
      ref={handleRef}
      onBlur={props.onBlur}
      size="small"
      startIcon={<AccessTimeIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ?? valueStr}
    </Button>
  );
}

export default function CustomTimePicker({
  label,
  value,
  onChange,
  onBlur,
  helperText,
  error,
  minTime,
  maxTime,
}: {
  label?: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  onBlur?: () => void;
  helperText?: string;
  error?: boolean;
  minTime?: Dayjs;
  maxTime?: Dayjs;
}) {
  return (
    <FormControl error={error} fullWidth>
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          value={value}
          onChange={onChange}
          slots={{ field: ButtonField }}
          slotProps={{
            nextIconButton: { size: "small" },
            previousIconButton: { size: "small" },
            field: { onBlur },
          }}
          minTime={minTime}
          maxTime={maxTime}
        />
      </LocalizationProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
