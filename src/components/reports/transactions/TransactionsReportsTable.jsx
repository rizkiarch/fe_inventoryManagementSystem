import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { reportsApi } from "../../../api/ReportsApi";
import { Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import TableSkeleton from "../../skeletons/TableSkeleton";
import TableHeader from "../../tables/TableHeader";
import { FileDownload, PictureAsPdf } from "@mui/icons-material";
import { format } from "date-fns";
import { saveAs } from 'file-saver';

export default function TransactionsReportsTable() {
    const queryClient = useQueryClient();
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(100);
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions', search, start_date, end_date],
        queryFn: () => reportsApi.getTransactions({
            search: search,
            start_date: start_date,
            end_date: end_date
        }),
        retry: 1,
        keepPreviousData: true
    });

    useEffect(() => {
        if (transactions?.start_date && transactions?.end_date) {
            setStartDate(transactions.start_date);
            setEndDate(transactions.end_date);
        }
    }, [transactions]);

    useEffect(() => {
        if (transactions?.end_date) {
            queryClient.prefetchQuery({
                queryKey: ['transactions', search, start_date, end_date],
                queryFn: () => reportsApi.getTransactions({
                    search: search,
                    start_date,
                    end_date
                })
            });
        }
    }, [transactions, search, queryClient, start_date, end_date]);

    const summaryData = useMemo(() => {
        if (!Array.isArray(transactions?.data)) return {};

        return transactions.data.reduce((acc, transaction) => {
            const itemName = transaction.item?.name;
            const itemCode = transaction.item?.unique_code;
            const date = format(new Date(transaction.created_at), 'dd-MM-yy');
            const dateKey = format(new Date(transaction.created_at), 'MM-yyyy');
            if (!itemName) return acc;

            const key = `${itemCode}_${dateKey}`;

            if (!acc[key]) {
                acc[key] = {
                    date: date,
                    code: transaction.item.unique_code,
                    name: itemName,
                    inQty: 0,
                    outQty: 0,
                    transactionsIn: 0,
                    transactionsOut: 0,
                };
            }

            if (transaction.type === 'in') {
                acc[key].transactionsIn += 1;
            } else if (transaction.type === 'out') {
                acc[key].transactionsOut += 1;
            }

            if (transaction.type === 'in') {
                acc[key].inQty += transaction.qty;
            } else if (transaction.type === 'out') {
                acc[key].outQty += transaction.qty;
            }

            return acc;
        }, {});
    }, [transactions]);

    const rows = [
        { id: 'no', name: 'No', align: 'center', width: '50px' },
        { id: 'date', name: 'Date', width: '100px' },
        { id: 'code', name: 'Code Product', width: '120px' },
        { id: 'name', name: 'Name Product', width: '100px' },
        { id: 'transactionIn', name: 'Transactions IN', align: 'center', width: '120px' },
        { id: 'transactionOut', name: 'Transactions Out', align: 'center', width: '120px' },
        { id: 'total', name: 'Transactions Total', align: 'center', width: '100px' }
    ];

    const handleStartDate = (e) => {
        e.preventDefault();
        setStartDate(e.target.value || new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    }

    const handleEndDate = (e) => {
        e.preventDefault();
        setEndDate(e.target.value || new Date().toISOString().split('T')[0]);
    }

    const handleExportPdf = async () => {
        try {
            const blob = await reportsApi.exportTransactionsToPdf({ start_date, end_date });
            saveAs(blob, `transactions_report_${start_date}_to_${end_date}.pdf`);
        } catch (error) {
            console.error('Failed to export PDF:', error);
            alert('Failed to export PDF');
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await reportsApi.exportTransactionsToExcel({ start_date, end_date });
            saveAs(blob, `transactions_report_${start_date}_to_${end_date}.xlsx`);
        } catch (error) {
            console.error('Failed to export Excel:', error);
            alert('Failed to export Excel');
        }
    };
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} spacing={2} sx={{ mb: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">Transactions Reports</Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <TextField
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                value={start_date || new Date(new Date().setDate(1)).toISOString().split('T')[0]}
                                onChange={handleStartDate}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                                value={end_date || new Date().toISOString().split('T')[0]}
                                onChange={handleEndDate}
                            />
                        </Stack>
                    </Grid>

                    {/* Tombol Export */}
                    <Grid item xs={12} sm={4}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownload />}
                                onClick={handleExportExcel}
                            >
                                Export Excel
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PictureAsPdf />}
                                onClick={handleExportPdf}
                            >
                                Export PDF
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>

            <TableContainer sx={{
                minHeight: 440, maxHeight: 440, border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }} >
                {isLoading ? (
                    <TableSkeleton rowCount={rows?.rows?.length} />
                ) : (
                    <Table sx={{ tableLayout: "fixed", width: "100%" }} stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableHeader rows={rows} />
                        </TableHead>
                        <TableBody>
                            {Object.values(summaryData).map((item, index) => (
                                <TableRow key={item.code}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell>
                                        {item.date}
                                    </TableCell>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="center" sx={{ color: 'success.main' }}>
                                        {item.transactionsIn}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: 'error.main' }}>
                                        {item.transactionsOut}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                        {item.transactionsIn - item.transactionsOut}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

            </TableContainer>
        </Paper>
    )
}