'use client';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import AuthChangePassword from 'sections/auth/auth-forms/AuthChangePassword';
import MainCard from 'components/MainCard';

// ================================|| CHANGE PASSWORD ||================================ //

export default function ChangePassword() {
  return (
    <Box sx={{ p: 3 }}>
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
              <Typography variant="h3">Change Password</Typography>
              <Typography color="secondary">Update your account password</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthChangePassword />
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
} 