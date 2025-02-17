import { Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { format, getYear, parseISO } from "date-fns";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardChart = ({ chart }) => {
    console.log(chart);
    const [timeRange, setTimeRange] = useState('year');

    const processYearlyData = (data) => {
        const yearlyData = data?.data?.reduce((acc, transaction) => {
            const year = getYear(parseISO(transaction.created_at));
            const type = transaction.type;

            if (!acc[year]) {
                acc[year] = { year, in: 0, out: 0 };
            }

            if (type === 'in') {
                acc[year].in += transaction.qty;
            } else {
                acc[year].out += transaction.qty;
            }

            return acc;
        }, {});

        return Object.values(yearlyData || {}).sort((a, b) => a.year - b.year);
    };

    const processMonthlyData = (data) => {
        const monthlyData = data?.data?.reduce((acc, transaction) => {
            const date = parseISO(transaction.created_at);
            const monthKey = format(date, 'yyyy-MM');
            const type = transaction.type;

            if (!acc[monthKey]) {
                acc[monthKey] = {
                    month: format(date, 'MMM yyyy'),
                    in: 0,
                    out: 0,
                    sortKey: monthKey
                };
            }

            if (type === 'in') {
                acc[monthKey].in += transaction.qty;
            } else {
                acc[monthKey].out += transaction.qty;
            }

            return acc;
        }, {});

        return Object.values(monthlyData || {})
            .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
            .slice(-12); // Show last 12 months
    };

    const chartData = timeRange === 'year'
        ? processYearlyData(chart)
        : processMonthlyData(chart);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: 1
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {timeRange === 'year' ? `Year ${label}` : label}
                    </Typography>
                    {payload.map((entry) => (
                        <Typography
                            key={entry.name}
                            variant="body2"
                            sx={{ color: entry.color, mb: 0.5 }}
                        >
                            {`${entry.status === 'in' ? 'Stock In' : 'Stock Out'}: ${entry.value}`}
                        </Typography>
                    ))
                    }
                </Box >
            );
        }
        return null;
    };


    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 360,
                bgcolor: 'background.paper',
                borderRadius: 2
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Typography
                    component="h2"
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                >
                    Transactions Overview
                </Typography>
                <ToggleButtonGroup
                    size="small"
                    value={timeRange}
                    exclusive
                    onChange={(e, newValue) => {
                        if (newValue !== null) {
                            setTimeRange(newValue);
                        }
                    }}
                >
                    <ToggleButton value="month">
                        Monthly
                    </ToggleButton>
                    <ToggleButton value="year">
                        Yearly
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Box sx={{ flex: 1, width: '100%' }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={timeRange === 'year' ? 'year' : 'month'}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="in"
                            name="Stock In"
                            fill="#4caf50"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="out"
                            name="Stock Out"
                            fill="#ef5350"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

export default DashboardChart;