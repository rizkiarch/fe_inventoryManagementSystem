import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import {
    Add as AddIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
// import ProductInForm from '../components/transactions/ProductInForm';
// import ProductOutForm from '../components/transactions/ProductOutForm';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [openForm, setOpenForm] = useState(false);

    // Fetch Transactions
    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', activeTab],
        queryFn: async () => {
            const response = await api.get('/transactions', {
                params: { type: activeTab === 0 ? 'in' : 'out' }
            });
            return response.data;
        }
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={6}>
                    <Typography variant="h4">Transactions</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenForm}
                    >
                        {activeTab === 0 ? 'Product In' : 'Product Out'}
                    </Button>
                </Grid>
            </Grid>

            <Paper>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                >
                    <Tab label="Product In" />
                    <Tab label="Product Out" />
                </Tabs>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions?.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.product_name}</TableCell>
                                    <TableCell>{transaction.quantity}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {activeTab === 0 ? 'Product In' : 'Product Out'}
                </DialogTitle>
                <DialogContent>
                    {/* {activeTab === 0 ? (
                        <ProductInForm onClose={handleCloseForm} />
                    ) : (
                        <ProductOutForm onClose={handleCloseForm} />
                    )} */}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Transactions;