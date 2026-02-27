import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value?: string | number;
  unit?: string;
  badge?: React.ReactNode;
  chart?: React.ReactNode;
  action?: React.ReactNode;
  subtext?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  value,
  unit,
  badge,
  chart,
  action,
  subtext,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default'
            }}>
              {icon}
            </Box>
            <Typography variant="subtitle1" color="text.primary">
              {title}
            </Typography>
          </Box>
          {badge && badge}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            {value !== undefined ? (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography variant="h4" component="span" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
                {unit && (
                  <Typography variant="body2" color="text.secondary" component="span">
                    {unit}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>
                --
              </Typography>
            )}

            {subtext && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtext}
              </Typography>
            )}
          </Box>

          {chart && <Box sx={{ width: '40%', height: 40 }}>{chart}</Box>}
          {action && <Box>{action}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
