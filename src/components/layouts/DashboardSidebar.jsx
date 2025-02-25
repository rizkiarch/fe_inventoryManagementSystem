import React, { useState } from 'react';
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
    useTheme,
    Collapse
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    BarChart as BarChartIcon,
    Inventory as InventoryIcon,
    ArrowRight as ArrowRightIcon,
    Assessment as AssessmentIcon,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material';

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <ShoppingCartIcon />, path: '/dashboard/products' },
    { text: 'Transactions', icon: <PeopleIcon />, path: '/dashboard/transactions' },
    // { text: 'Stocks', icon: <InventoryIcon />, path: '/dashboard/stocks' },
    {
        text: 'Reports',
        icon: <AssessmentIcon />,
        path: '/dashboard/reports',
        subItems: [
            { text: 'Transactions', path: '/dashboard/reports/transactions' },
            { text: 'Stocks', path: '/dashboard/reports/stocks' }
        ]
    },
    // { text: 'Analytics', icon: <BarChartIcon />, path: '/dashboard/analytics' },
];

const DashboardSidebar = ({ open, onDrawerToggle, isMobile }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [reportsOpen, setReportsOpen] = useState(false);

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setReportsOpen(!reportsOpen);
        } else {
            navigate(item.path);
            if (isMobile) {
                onDrawerToggle();
            }
        }
    };

    const isItemActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
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
                        <React.Fragment key={item.text}>
                            <ListItem
                                button
                                onClick={() => handleMenuClick(item)}
                                sx={{
                                    bgcolor: isItemActive(item.path) ? 'action.selected' : 'inherit',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.subItems && (reportsOpen ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>

                            {item.subItems && (
                                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem) => (
                                            <ListItem
                                                button
                                                key={subItem.text}
                                                onClick={() => handleMenuClick(subItem)}
                                                sx={{
                                                    pl: 4,
                                                    bgcolor: location.pathname === subItem.path ? 'action.selected' : 'inherit',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                    },
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <ArrowRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={subItem.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default DashboardSidebar;