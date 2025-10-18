import { TextField, type TextFieldProps } from "@mui/material";
import React from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { NumericFormat, type OnValueChange } from "react-number-format";

// Combine the props from react-hook-form's field with our custom props
export interface NumberInputProps
  extends Omit<ControllerRenderProps, "onChange"> {
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  variant?: TextFieldProps["variant"];
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Wrap the component in forwardRef to handle the ref from the Controller
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { name, value, onBlur, onChange, label, placeholder, variant } =
      props;

    const handleValueChange: OnValueChange = (values) => {
      onChange(values.floatValue);
    };

    return (
      <NumericFormat
        name={name}
        value={value}
        onBlur={onBlur}
        onValueChange={handleValueChange}
        label={label}
        placeholder={placeholder}
        customInput={TextField}
        variant={variant || "outlined"}
        fullWidth={props.fullWidth}
        error={props.error}
        helperText={props.helperText}
        getInputRef={ref}
        disabled={props.disabled}
        // thousandSeparator
        // valueIsNumericString
      />
    );
  }
);

export default NumberInput;
