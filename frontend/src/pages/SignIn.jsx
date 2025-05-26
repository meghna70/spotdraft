import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { signIn } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
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
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn() {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    try {
      const res = await dispatch(signIn({ email, password })).unwrap();
      console.log('User signed in:', res);
      navigate('/home');
    } catch (err) {
      console.error('Sign in failed:', err);
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Typography sx={{ textAlign: 'center' }}>
                <Link href="/forgotPassword" variant="body2">
                  Forgot Password?
                </Link>
              </Typography>
            </FormControl>
            {errorMsg && <Typography color="error">{errorMsg}</Typography>}
            <CustomButton type="submit" fullWidth variant="contained">
              Sign in
            </CustomButton>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => alert('Sign in with Google')} startIcon={<GoogleIcon />}>
              Sign in with Google
            </Button>
            <Button fullWidth variant="outlined" onClick={() => alert('Sign in with Facebook')} startIcon={<FacebookIcon />}>
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link href="/signup" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
