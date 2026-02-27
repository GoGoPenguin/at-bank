import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Slider,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecordDataForm: React.FC = () => {
  const navigate = useNavigate();
  const [hr, setHr] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [rpe, setRpe] = useState<number>(5);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    // In a real app we would save to state/backend here
    setOpen(true);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  return (
    <Box sx={{
      height: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Area */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        pt: 4,
        pb: 3,
        px: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        mb: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Log Today's Data
        </Typography>
        <IconButton color="inherit" onClick={() => navigate(-1)}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Form Content */}
      <Box sx={{ px: 2.5, flexGrow: 1, pb: 4 }}>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Resting Heart Rate
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g. 62"
              type="number"
              value={hr}
              onChange={(e) => setHr(e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption" color="text.secondary">bpm</Typography>
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Body Weight
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g. 75.4"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              InputProps={{
                endAdornment: <Typography variant="caption" color="text.secondary">kg</Typography>
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Workout RPE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rate 1-10 intensity
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={rpe}
                onChange={(_e, newValue) => setRpe(newValue as number)}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="on"
                sx={{
                  color: rpe > 7 ? 'error.main' : rpe > 4 ? 'secondary.main' : 'success.main',
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Action Area */}
      <Box sx={{ p: 2.5, bgcolor: 'background.paper', borderTop: '1px solid #e0e0e0' }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={!hr && !weight && rpe === 5}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Save Log
        </Button>
      </Box>

      <Snackbar open={open} autoHideDuration={3000}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          Data logged successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecordDataForm;
