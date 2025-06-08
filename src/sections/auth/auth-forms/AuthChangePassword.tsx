'use client';

import { useState, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  InputAdornment,
  Alert,
  Box,
  Typography,
  FormControl
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import useScriptRef from 'hooks/useScriptRef';

// password validation
import {
  isNumber,
  isLowercaseChar,
  isUppercaseChar,
  isSpecialChar,
  minLength
} from 'utils/password-validation';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// types
import { StringColorProps } from 'types/password';

// ============================|| CHANGE PASSWORD ||============================ //

const AuthChangePassword = () => {
  const scriptedRef = useScriptRef();
  const router = useRouter();
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [success, setSuccess] = useState(false);

  const isPasswordValid = (password: string) => {
    return minLength(password) &&
      isNumber(password) &&
      isLowercaseChar(password) &&
      isUppercaseChar(password) &&
      isSpecialChar(password);
  };

  const handleClickShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  return (
    <>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password changed successfully!
        </Alert>
      )}

      <Formik
        initialValues={{
          currentPassword: '',
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          currentPassword: Yup.string().required('Current password is required'),
          password: Yup.string()
            .required('New password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be less than 50 characters')
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?\(\)])[A-Za-z\d-+_!@#$%^&*.,?\(\)]{8,}$/,
              'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            )
            .test('different-password', 'New password must be different from current password', function(value) {
              return value !== this.parent.currentPassword;
            }),
          confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await fetch('/api/change-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                oldPassword: values.currentPassword,    // ✅ Changed from 'currentPassword' to 'oldPassword'
                newPassword: values.password           // ✅ This was already correct
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Failed to change password');
            }

            console.log('✅ API call successful, scriptedRef.current:', scriptedRef.current);
            setSuccess(true);
            setStatus({ success: true });
            setSubmitting(false);

            console.log('🚀 Setting up redirect timeout');
            // Redirect after 2 seconds
            setTimeout(() => {
              console.log('⏰ Timeout executing, redirecting...');
              router.push('/sample-page');
            }, 2000);

          } catch (error: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: error.message || 'An error occurred while changing password' });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Current Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="current-password">Current Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.currentPassword && errors.currentPassword)}
                    id="current-password"
                    type={showPassword.current ? 'text' : 'password'}
                    value={values.currentPassword}
                    name="currentPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('current')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword.current ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter current password"
                  />
                </Stack>
                {touched.currentPassword && errors.currentPassword && (
                  <FormHelperText error id="helper-text-current-password">
                    {errors.currentPassword}
                  </FormHelperText>
                )}
              </Grid>

              {/* New Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="new-password">New Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="new-password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('new')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword.new ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter new password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-new-password">
                    {errors.password}
                  </FormHelperText>
                )}

                {/* Password Strength Indicator */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>

                {/* Password Requirements */}
                {values.password && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Password Requirements:
                    </Typography>
                    <Stack spacing={0.5}>
                      {[
                        { check: minLength(values.password), text: 'At least 8 characters' },
                        { check: isNumber(values.password), text: 'At least one number' },
                        { check: isLowercaseChar(values.password), text: 'At least one lowercase letter' },
                        { check: isUppercaseChar(values.password), text: 'At least one uppercase letter' },
                        { check: isSpecialChar(values.password), text: 'At least one special character' }
                      ].map((req, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            color: req.check ? 'success.main' : 'error.main',
                            textDecoration: req.check ? 'line-through' : 'none',
                            fontSize: '0.75rem'
                          }}
                        >
                          {req.check ? '✓' : '○'} {req.text}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('confirm')}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword.confirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Confirm new password"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-confirm-password">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>

              {/* Submit Error */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting || !isPasswordValid(values.password)}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {isSubmitting ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthChangePassword;