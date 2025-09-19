import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";

export type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  interval?: string;
};

export default function StatCard({
  icon,
  title,
  value,
  interval,
}: StatCardProps) {
  const { mode } = useColorScheme();

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1, px: 3 }}>
      <CardContent sx={{ height: "100%" }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid container alignItems="center" justifyContent="center">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) =>
                  mode === "dark"
                    ? theme.palette.primary.main
                    : theme.palette.grey[200],
                borderRadius: "50%",
                width: 70,
                height: 70,
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="p">
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval ?? ""}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
