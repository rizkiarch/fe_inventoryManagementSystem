import { KeyboardArrowDown, KeyboardArrowUp, Print } from "@mui/icons-material";
import { Box, Button, Collapse, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { format } from 'date-fns';
import { useState } from "react";
import StockPrintForm from "../../ui-components/print/StockPrintForm";

const StocksReportsTableList = ({ item, index }) => {
    const [open, setOpen] = useState(false);
    const [openPrintDialog, setOpenPrintDialog] = useState(false);

    const processTransactions = (transactions) => {
        let runningTotal = 0;
        return transactions
            .filter(transaction => transaction.status === "success")
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map(transaction => {
                const qtyIn = transaction.type === 'in' ? transaction.qty : 0;
                const qtyOut = transaction.type === 'out' ? transaction.qty : 0;
                runningTotal += qtyIn - qtyOut;
                return {
                    ...transaction,
                    qty_in: qtyIn,
                    qty_out: qtyOut,
                    total: runningTotal
                };
            });
    };

    const processedTransactions = item?.transactions ? processTransactions(item.transactions) : [];

    const handlePrintStockCard = () => {
        setOpenPrintDialog(true);
    };

    return (
        <>
            <TableRow key={item.unique_code}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    {item.date}
                </TableCell>
                <TableCell>{item.unique_code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center" sx={{ color: 'success.main' }}>
                    {item.inQty}
                </TableCell>
                <TableCell align="center" sx={{ color: 'error.main' }}>
                    {item.outQty}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {item.inQty - item.outQty}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Transaction History
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={handlePrintStockCard}
                                >
                                    <Print />
                                    Print Stock Card
                                </Button>
                            </Stack>
                            <Table size="small" aria-label="transaction history">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Stock In</TableCell>
                                        <TableCell align="right">Stock Out</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processedTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell component="th" scope="row">
                                                {format(new Date(transaction.created_at), 'dd MMM yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell align="right">
                                                {transaction.qty_in || '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {transaction.qty_out || '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {transaction.total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow >

            <StockPrintForm
                open={openPrintDialog}
                onClose={() => setOpenPrintDialog(false)}
                product={{
                    ...item,
                    transactions: processedTransactions
                }}
            />
        </>
    )
};

export default StocksReportsTableList;