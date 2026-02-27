import Avatar from "@mui/material/Avatar";

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

/**
 * Generates avatar properties from a name, with support for both
 * zh-TW (Traditional Chinese) and en-US (US English) formats.
 */
function stringAvatar(name: string) {
  const isChinese = /[\u4E00-\u9FFF]/.test(name);
  let children: string;

  if (isChinese) {
    children = name.slice(-2);
  } else if (name.includes(" ")) {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const secondNameInitial = nameParts[1] ? nameParts[1][0] : "";
    children = `${firstNameInitial}${secondNameInitial}`;
  } else {
    children = name.substring(0, 2);
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: children.toUpperCase(),
  };
}

export default function LetterAvatar({
  name,
  variant = "circular",
  sx,
}: {
  name: string;
  variant?: "circular" | "rounded" | "square";
  sx?: object;
}) {
  const props = stringAvatar(name);
  return (
    <Avatar
      variant={variant}
      children={props.children}
      sx={{ width: 30, height: 30, fontSize: "0.875rem", ...props.sx, ...sx }}
    />
  );
}
