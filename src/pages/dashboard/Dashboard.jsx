import React from 'react';
import { Container, Grid, Paper, Typography, Button, List, Toolbar } from '@mui/material';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import DashboardChart from '../../components/dashboard/DashboardChart';
import DashboardRecent from '../../components/dashboard/DashboardRecent';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api/ReportsApi';
import { transactionsApi } from '../../api/TransactionsApi';
import DashboardAnalysis from '../../components/dashboard/DashboardAnalysis';

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

    const { data: transactions } = useQuery({
        queryKey: ['transactionRecent', start_date, end_date],
        queryFn: () => reportsApi.getTransactions({ start_date, end_date }),
        retry: 1,
        staleTime: 30000,
    })

    const { data: productCount } = useQuery({
        queryKey: ['product'],
        queryFn: () => reportsApi.getProductCount(),
        retry: 1,
        staleTime: 30000,
    });

    const { data: userCount } = useQuery({
        queryKey: ['user'],
        queryFn: () => reportsApi.getUserCount(),
        retry: 1,
        staleTime: 30000,
    });

    const { data: AnalisisAI } = useQuery({
        queryKey: ['AnalisisAI'],
        queryFn: () => reportsApi.getAnalisisAI(),
        retry: 1,
        staleTime: 30000,
    });

    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid container spacing={3} direction="row" alignItems="center">
                        <DashboardCard userCount={userCount} productCount={productCount} stock={stock} transaction={transaction} />
                    </Grid>

                    <Grid container spacing={3} direction="row" alignItems="center" sx={{ mt: 2 }}>
                        <Grid item xs={12} md={9}>
                            <DashboardChart transactions={transactions?.data} />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <DashboardRecent recent={transaction?.transactions} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} direction="row" alignItems="center" sx={{ mt: 2 }}>
                        <DashboardAnalysis AnalisisAI={AnalisisAI} />
                    </Grid>
                </Grid>
            </Container>
        </DashboardLayout>
    );
};

export default Dashboard;