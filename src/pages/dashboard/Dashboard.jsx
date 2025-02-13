import React from 'react';
import { Container, Grid, Paper, Typography, Button, List, Toolbar } from '@mui/material';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/shared/StartCard';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth={false}>
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
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 360 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Transactions Overview
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 360 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Recent Activity
                                </Typography>
                                <List />
                                <Button variant="outlined" color="primary" sx={{ mt: 'auto' }}>
                                    View All Activities
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} direction="row" alignItems="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 360 }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Analysis AI
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </DashboardLayout>
    );
};

export default Dashboard;