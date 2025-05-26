import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './redux/store';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';

import Home from './pages/Home';
import AddFile from './pages/AddFile';
import SharedFiles from './pages/SharedFiles';
import MyFiles from './pages/MyFiles';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from './redux/userSlice';
import { createTheme } from '@mui/material';
import UploadFileModal from './component/UploadFileModal';
import ForgetPassword from './pages/ForgotPassword';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'add', title: 'Add File', icon: <AddCircleOutlineIcon /> },
  { segment: 'home', title: 'Home', icon: <HomeIcon /> },
  { segment: 'files', title: 'My Files', icon: <FolderOutlinedIcon /> },
  { segment: 'Shared_files', title: 'Shared Files', icon: <Groups2RoundedIcon /> },
];

const theme = createTheme({
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {},
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function SidebarFooterAccount() {
  const user = useSelector((state) => state.user.user || JSON.parse(localStorage.getItem('user')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
    handleClose();
    navigate('/signin');
  };

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2, mb: 1 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Stack direction="row" alignItems="center" spacing={2} p={1}>
          <Avatar>{initial}</Avatar>
          <Stack>
            <Typography color="text.primary" align="left" variant="body">
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Stack>
        </Stack>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

function DashboardRenderer() {

  const reduxUser = useSelector((state) => state.user.user);
  const user = reduxUser || JSON.parse(localStorage.getItem('user'));

  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  let PageComponent;
  switch (location.pathname) {
    case '/home':
    case '/':
      PageComponent = Home;
      break;
    case '/add':
      PageComponent = AddFile;
      break;
    case '/files':
      PageComponent = MyFiles;
      break;
    case '/Shared_files':
      PageComponent = SharedFiles;
      break;
    default:
      PageComponent = () => (
        <Box sx={{ py: 4 }}>
          <Typography>Page not found</Typography>
        </Box>
      );
  }

  return (
    <AppProvider navigation={NAVIGATION} theme={theme}>
      <DashboardLayout slots={{ sidebarFooter: SidebarFooterAccount }}>
        <PageComponent />
      </DashboardLayout>
    </AppProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path = '/forgotPassword' element={<ForgetPassword/>}/>          
          <Route path="/*" element={<DashboardRenderer />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
