import React, { useState } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Grid,
    Paper,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const Dashboard2 = () => {
    const [open, setOpen] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState('Dashboard');
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
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

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon /> },
        { text: 'Products', icon: <ShoppingCartIcon /> },
        { text: 'Transactions', icon: <PeopleIcon /> },
        { text: 'Reports', icon: <SettingsIcon /> },
        { text: 'Analytics', icon: <BarChartIcon /> },
    ];

    const StatCard = ({ title, value, color }) => (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                }
            }}
        >
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="h2" sx={{ color }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh', flexDirection: 'column' }}>
            <CssBaseline />
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
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {selectedMenu}
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
                {/* {recentActivities.map((activity) => (
                    <MenuItem key={activity.id} onClick={handleNotificationClose}>
                        <Box>
                            <Typography variant="body1">{activity.text}</Typography>
                            <Typography variant="caption" color="textSecondary">
                                {activity.time}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))} */}
            </Menu>

            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={open}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '240px',
                        boxSizing: 'border-box',
                        transform: open ? 'none' : 'translateX(-240px)',
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
                                onClick={() => handleMenuClick(item.text)}
                                sx={{
                                    bgcolor: selectedMenu === item.text ? 'action.selected' : 'inherit',
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

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    marginLeft: { xs: 0, sm: open ? '70px' : 0 },
                    transition: theme.transitions.create(['margin-left', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    backgroundColor: theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" >
                    <Grid container spacing={3}>
                        <Grid container spacing={3} direction="row" alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Transactions In" value="2,573" color="primary.main" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Transactions Out" value="2,573" color="primary.main" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Stock In" value="$15,234" color="success.main" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Stock Out" value="1,234" color="warning.main" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} direction="row" alignItems="center" sx={{ mt: 2 }}>

                            <Grid item xs={12} md={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 360,
                                    }}
                                >
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Sales Overview
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 360,
                                    }}
                                >
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Recent Activity
                                    </Typography>
                                    <List>

                                    </List>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mt: 'auto' }}
                                    >
                                        View All Activities
                                    </Button>
                                </Paper>
                            </Grid >
                        </Grid >
                    </Grid >
                </Container >
            </Box >
        </Box >
    );
};

export default Dashboard2;