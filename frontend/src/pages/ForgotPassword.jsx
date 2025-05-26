import * as React from 'react';
import {
    Box, Button, CssBaseline, Divider, FormControl,
    FormLabel, Link, TextField, Typography, Stack, Card as MuiCard
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { newPassword, sendOtp, verifyOtp } from '../redux/userSlice';

const CustomButton = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: '#222',
    fontWeight: 500,
    borderRadius: '0.5rem',
    fontSize: '1rem',
    lineHeight: '2rem',
    padding: '0.7rem 2rem',
    textAlign: 'center',
    marginRight: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#333',
    },
}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: '100dvh',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    },
}));

export default function ForgetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, successMessage } = useSelector((state) => state.user);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [step, setStep] = React.useState(1);
    const [otp, setOtp] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

    const handleNewPassword = async (event) => {
        event.preventDefault();
        setErrorMsg('');

        if (!password) {
            setErrorMsg('New password is required.');
            return;
        }

        try {
            const res = await dispatch(newPassword({email: email, newPassword:password})).unwrap();
            console.log('Password reset successful:', res);
            navigate('/signin');
        } catch (err) {
            console.error('Reset failed:', err);
            setErrorMsg('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="center">
                {step === 1 && (
                    <StepOne email={email} setEmail={setEmail} setStep={setStep} />
                )}
                {step === 2 && (
                    <StepTwo otp={otp} setOtp={setOtp} email={email} setStep={setStep} />
                )}
                {step === 3 && (
                    <StepThree
                        password={password}
                        setPassword={setPassword}
                        handleNewPassword={handleNewPassword}
                        errorMsg={errorMsg}
                    />
                )}
            </SignInContainer>
        </div>
    );
}

// Step One – Email Input
const StepOne = ({ email, setEmail, setStep }) => {
    const dispatch = useDispatch();
    const [localError, setLocalError] = React.useState('');
    const [localSuccess, setLocalSuccess] = React.useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLocalError('');
        setLocalSuccess('');

        if (!email || !email.includes('@')) {
            setLocalError('Please enter a valid email');
            return;
        }

        try {
            const result = await dispatch(sendOtp(email)).unwrap();
            setLocalSuccess(result.message || 'OTP sent successfully!');
            setStep(2);
        } catch (err) {
            setLocalError(err);
        }
    };

    return (
        <Card variant="outlined">
            <Typography component="h1" variant="h4">
                Forget Password
            </Typography>
            <Box component="form" onSubmit={handleSendOTP} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                {localError && (
                    <Typography color="error">{localError}</Typography>
                )}
                {localSuccess && (
                    <Typography color="primary">{localSuccess}</Typography>
                )}
                <CustomButton type="submit" fullWidth variant="contained">
                    Send OTP
                </CustomButton>
            </Box>
            <Divider>
                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Typography sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link href="/signup" variant="body2">
                    Sign up
                </Link>
            </Typography>
        </Card>
    );
};

// Step Two – OTP Verification
const StepTwo = ({ otp, setOtp, email, setStep }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user);
    const [errorMsg, setErrorMsg] = React.useState('');
   
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!otp || otp.length < 4) {
            setErrorMsg('Please enter the full OTP');
            return;
        }

        try {
            await dispatch(verifyOtp({ email, otp })).unwrap();
            setStep(3); 
        } catch (err) {
            setErrorMsg(err);
        }
    };

    return (
        <Card variant="outlined">
            <Typography component="h1" variant="h4">
                Enter OTP
            </Typography>
            <Box component="form" onSubmit={handleVerifyOTP} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                    <FormLabel>Check your email</FormLabel>
                    <MuiOtpInput value={otp} onChange={setOtp} />
                </FormControl>
                <CustomButton type="submit" fullWidth variant="contained">
                {loading ? 'Verifying...' : 'Verify Code'}
                </CustomButton>
            </Box>
        </Card>
    );
};

// Step Three – Reset Password
const StepThree = ({ password, setPassword, handleNewPassword, errorMsg }) => {
    return (
        <Card variant="outlined">
            <Typography component="h1" variant="h4">
                Reset Password
            </Typography>
            <Box component="form" onSubmit={handleNewPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                    <FormLabel htmlFor="password">New Password</FormLabel>
                    <TextField
                        required
                        fullWidth
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                {errorMsg && <Typography color="error">{errorMsg}</Typography>}
                <CustomButton type="submit" fullWidth variant="contained">
                    Reset Password
                </CustomButton>
            </Box>
        </Card>
    );
};
