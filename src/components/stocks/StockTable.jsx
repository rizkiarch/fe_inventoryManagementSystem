import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import TableSkeleton from "../skeletons/TableSkeleton";
import TableHeader from "../tables/TableHeader";
import TablePaginationCustom from "../tables/TablePaginationCustom";
import { QrCodeScanner, Search } from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../../api/TransactionsApi";
import { useEffect, useState } from "react";

export default function StockTable() {
    const role = localStorage.getItem('role');

    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const { data: transactions, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey: ['transactions', page, rowsPerPage, search],
        queryFn: () => transactionsApi.getTransactions({
            page: page + 1,
            per_page: rowsPerPage,
            search: search
        }),
        retry: 1,
        keepPreviousData: true,
    });

    useEffect(() => {
        if (transactions?.next_page_url) {
            queryClient.prefetchQuery({
                queryKey: ['transactions', page + 2, rowsPerPage, search],
                queryFn: () => transactionsApi.getTransactions({
                    page: page + 2,
                    per_page: rowsPerPage,
                    search: search
                }),
            });
        }

        search === '' && queryClient.invalidateQueries('transactions');
    }, [transactions, page, rowsPerPage, search, queryClient]);

    const rows = [
        {
            id: 'no',
            name: 'No',
            align: 'center',
            width: '50px'
        },
        {
            id: 'code',
            name: 'Code Product',
            width: '120px'
        },
        {
            id: 'name',
            name: 'Name Product',
            width: '150px'
        },
        {
            id: 'qtyIn',
            name: 'QTY IN',
            align: 'center',
            width: '80px'
        },
        {
            id: 'qtyOut',
            name: 'QTY OUT',
            align: 'center',
            width: '80px'
        },
        {
            id: 'total',
            name: 'Total',
            align: 'center',
            width: '80px'
        },
        {
            id: 'actions',
            name: 'Actions',
            align: 'center',
            width: '100px'
        }
    ];

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4">Transactions</Typography>

                    <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                        <Autocomplete
                            freeSolo
                            options={transactions?.data?.map((transaction) => transaction.item.name) || []}
                            onInputChange={(event, newInputValue) => setSearch(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Products"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{ minWidth: 200 }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Search color="action" />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Stack>

                    <Button
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >
                        <QrCodeScanner />
                        Print Stocks Card
                    </Button>
                </Stack>
                <TableContainer sx={{ minHeight: 440, maxHeight: 440 }} >
                    {isLoading ? (
                        <TableSkeleton rowCount={rows?.rows?.length} />
                    ) : (
                        <Table sx={{ tableLayout: "fixed", width: "100%" }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableHeader rows={rows} />
                            </TableHead>
                            <TableBody>
                                {/* {transactions?.total > 0 ? (
                                    transactions?.data?.map((transaction, index) => (
                                        <TransactionList
                                            key={transaction.id}
                                            transaction={transaction}
                                            width={rows}
                                            no={(page * rowsPerPage) + index + 1}
                                            role={role}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={rows.length} align="center">
                                            <Typography variant="h6" color="textSecondary">
                                                No transactions found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )} */}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <TablePaginationCustom
                    length={transactions?.total}
                    onChange={(newPage, newRowsPerPage) => {
                        setPage(newPage);
                        setRowsPerPage(newRowsPerPage);
                    }}
                />
            </Paper>

            {/* <TransactionForm
                open={openModal}
                onClose={() => setOpenModal(false)}
                transactions={transactions}
                role={role}
            /> */}
        </>
    );
}