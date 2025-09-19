import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectProps } from "@mui/material/Select";
import { useColorScheme } from "@mui/material/styles";
import { t } from "i18next";

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as "system" | "light" | "dark")
      }
      SelectDisplayProps={{
        // @ts-expect-error: unrecognized prop
        "data-screenshot": "toggle-mode",
      }}
      {...props}
    >
      <MenuItem value="system">{t("colorMode.system")}</MenuItem>
      <MenuItem value="light">{t("colorMode.light")}</MenuItem>
      <MenuItem value="dark">{t("colorMode.dark")}</MenuItem>
    </Select>
  );
}
