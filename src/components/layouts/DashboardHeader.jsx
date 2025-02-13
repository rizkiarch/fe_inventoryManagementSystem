import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon
} from '@mui/icons-material';

const DashboardHeader = ({ open, onDrawerToggle }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationAnchor, setNotificationAnchor] = React.useState(null);
    const theme = useTheme();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'dashboard';
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    width: { xs: '100%', sm: open ? 'calc(100% - 240px)' : '100%' },
                    ml: { xs: 0, sm: open ? '240px' : 0 },
                    transition: theme.transitions.create(['width', 'margin-left'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>

                    <IconButton color="inherit" onClick={handleNotificationClick}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                        <Avatar sx={{ width: 32, height: 32, ml: 1 }}>
                            <PersonIcon />
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>My Account</MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
            </Menu>

            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
            >
                {/* Add notification items here */}
            </Menu>
        </>
    );
};

export default DashboardHeader;