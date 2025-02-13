import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
    const [open, setOpen] = React.useState(true);
    const [selectedMenu, setSelectedMenu] = React.useState('Dashboard');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleMenuClick = (text) => {
        setSelectedMenu(text);
        if (isMobile) {
            setOpen(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            <DashboardHeader
                open={open}
                selectedMenu={selectedMenu}
                onDrawerToggle={handleDrawerToggle}
            />
            <DashboardSidebar
                open={open}
                selectedMenu={selectedMenu}
                onDrawerToggle={handleDrawerToggle}
                onMenuClick={handleMenuClick}
                isMobile={isMobile}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { xs: '100%', sm: open ? 'calc(100% - 240px)' : '100%' },
                    marginLeft: { xs: 0, sm: open ? '240px' : 0 },
                    transition: theme.transitions.create(['margin-left', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    backgroundColor: theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;