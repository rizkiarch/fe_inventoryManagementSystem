import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    BarChart as BarChartIcon,
} from '@mui/icons-material';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <ShoppingCartIcon />, path: '/dashboard/products' },
    { text: 'Transactions', icon: <PeopleIcon />, path: '/dashboard/transactions' },
    { text: 'Reports', icon: <SettingsIcon />, path: '/dashboard/reports' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/dashboard/analytics' },
];

const DashboardSidebar = ({ open, onDrawerToggle, isMobile }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (path) => {
        navigate(path);
        if (isMobile) {
            onDrawerToggle();
        }
    };

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'persistent'}
            open={open}
            onClose={onDrawerToggle}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '240px',
                    boxSizing: 'border-box',
                    ...(open ? {} : { transform: 'translateX(-240px)' }),
                    transition: theme.transitions.create('transform', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
                    ZephyrosInv
                </Typography>
            </Toolbar>
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleMenuClick(item.path)}
                            sx={{
                                bgcolor: location.pathname === item.path ? 'action.selected' : 'inherit',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default DashboardSidebar;