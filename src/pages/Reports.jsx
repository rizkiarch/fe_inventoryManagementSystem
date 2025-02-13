import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Grid
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
// import TransactionReport from '../components/reports/TransactionReport';
// import StockReport from '../components/reports/StockReport';
import { api } from '../utils/api';

const Reports = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Fetch report data
    const { data: transactionReportData, isLoading: transactionLoading } = useQuery({
        queryKey: ['transaction-report'],
        queryFn: async () => {
            const response = await api.get('/reports/transaction');
            return response.data;
        }
    });

    const { data: stockReportData, isLoading: stockLoading } = useQuery({
        queryKey: ['stock-report'],
        queryFn: async () => {
            const response = await api.get('/reports/stock');
            return response.data;
        }
    });

    const handleExportPDF = async () => {
        try {
            const endpoint = activeTab === 0
                ? '/reports/transaction/export-pdf'
                : '/reports/stock/export-pdf';

            const response = await api.get(endpoint, {
                responseType: 'blob'
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeTab === 0 ? 'transaction' : 'stock'}_report.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    const handleExportExcel = async () => {
        try {
            const endpoint = activeTab === 0
                ? '/reports/transaction/export-excel'
                : '/reports/stock/export-excel';

            const response = await api.get(endpoint, {
                responseType: 'blob'
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeTab === 0 ? 'transaction' : 'stock'}_report.xlsx`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    const tabs = [
        {
            label: 'Transaction Report',
            // component: (
            //     <TransactionReport
            //         data={transactionReportData}
            //         isLoading={transactionLoading}
            //     />
            // )
        },
        {
            label: 'Stock Report',
            // component: (
            //     <StockReport
            //         data={stockReportData}
            //         isLoading={stockLoading}
            //     />
            // )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4">Reports</Typography>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleExportPDF}
                        >
                            Export PDF
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExportExcel}
                        >
                            Export Excel
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mb: 2 }}
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>

            {tabs[activeTab].component}
        </Box>
    );
};

export default Reports;