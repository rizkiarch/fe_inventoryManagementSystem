import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const DashboardChart = ({ transactions }) => {
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedYear, setSelectedYear] = useState(1);

    // Get unique years from transactions
    const years = useMemo(() => {
        if (!Array.isArray(transactions)) return [];
        const uniqueYears = [...new Set(transactions.map(t => new Date(t.created_at).getFullYear()))];
        return uniqueYears.sort();
    }, [transactions]);

    const chartData = useMemo(() => {
        if (!Array.isArray(transactions)) return [];

        const filteredTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.created_at);
            const transactionYear = date.getFullYear();
            const transactionMonth = date.getMonth() + 1;

            const yearMatch = years[selectedYear - 1] === transactionYear;
            const monthMatch = selectedMonth === 'all' || parseInt(selectedMonth) === transactionMonth;

            return yearMatch && monthMatch;
        });

        const groupedData = filteredTransactions.reduce((acc, transaction) => {
            const date = new Date(transaction.created_at);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[month - 1];

            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = {
                    year,
                    month,
                    masuk: 0,
                    keluar: 0,
                    monthName: monthName
                };
            }

            if (transaction.type === 'in') {
                acc[key].masuk += transaction.qty;
            } else if (transaction.type === 'out') {
                acc[key].keluar += transaction.qty;
            }

            return acc;
        }, {});

        return Object.values(groupedData).sort((a, b) => {
            if (a.year === b.year) {
                return a.month - b.month;
            }
            return a.year - b.year;
        });
    }, [transactions, selectedMonth, selectedYear, years]);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '1.5rem'
                    }}>
                    Grafik Transaksi Masuk & Keluar
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Bulan</InputLabel>
                        <Select
                            value={selectedMonth}
                            label="Bulan"
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <MenuItem value="all">Semua Bulan</MenuItem>
                            <MenuItem value="1">Januari</MenuItem>
                            <MenuItem value="2">Februari</MenuItem>
                            <MenuItem value="3">Maret</MenuItem>
                            <MenuItem value="4">April</MenuItem>
                            <MenuItem value="5">Mei</MenuItem>
                            <MenuItem value="6">Juni</MenuItem>
                            <MenuItem value="7">Juli</MenuItem>
                            <MenuItem value="8">Agustus</MenuItem>
                            <MenuItem value="9">September</MenuItem>
                            <MenuItem value="10">Oktober</MenuItem>
                            <MenuItem value="11">November</MenuItem>
                            <MenuItem value="12">Desember</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Tahun</InputLabel>
                        <Select
                            value={selectedYear.toString()}
                            label="Tahun"
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((yearIndex) => (
                                <MenuItem key={yearIndex} value={yearIndex.toString()}>
                                    Tahun {yearIndex} ({years[yearIndex - 1] || '...'})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="monthName"
                            tickFormatter={(month) => `${month}`}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="masuk" fill="#8884d8" name="Transaksi Masuk" animationDuration={1000} />
                        <Bar dataKey="keluar" fill="#82ca9d" name="Transaksi Keluar" animationDuration={1000} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default DashboardChart;