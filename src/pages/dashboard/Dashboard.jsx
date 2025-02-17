import React from 'react';
import { Container, Grid, Paper, Typography, Button, List, Toolbar } from '@mui/material';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import DashboardChart from '../../components/dashboard/DashboardChart';
import DashboardRecent from '../../components/dashboard/DashboardRecent';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api/ReportsApi';
import { transactionsApi } from '../../api/TransactionsApi';

const Dashboard = () => {
    const [start_date, setStartDate] = React.useState('');
    const [end_date, setEndDate] = React.useState('');

    const { data: stock, isLoading } = useQuery({
        queryKey: ['stock'],
        queryFn: () => reportsApi.getStocks(),
        retry: 1,
        staleTime: 30000,
    })

    const { data: transaction } = useQuery({
        queryKey: ['transaction'],
        queryFn: () => transactionsApi.getTransactions(),
        retry: 1,
        staleTime: 30000,
    })

    const { data: transactionRecent } = useQuery({
        queryKey: ['transactionRecent', start_date, end_date],
        queryFn: () => transactionsApi.getTransactions({ start_date, end_date }),
        retry: 1,
        staleTime: 30000,
    })

    console.log(transaction);

    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid container spacing={3} direction="row" alignItems="center">
                        <DashboardCard stock={stock} transaction={transaction} />
                    </Grid>

                    <Grid container spacing={3} direction="row" alignItems="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} md={9}>
                            <DashboardChart chart={transaction} />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <DashboardRecent recent={transaction?.transactions} />
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