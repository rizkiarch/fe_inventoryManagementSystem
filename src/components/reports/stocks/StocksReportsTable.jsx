import { FileDownload, KeyboardArrowDown, KeyboardArrowUp, PictureAsPdf, Print } from "@mui/icons-material";
import { Box, Button, Collapse, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import TableSkeleton from "../../skeletons/TableSkeleton";
import TableHeader from "../../tables/TableHeader";
import { reportsApi } from "../../../api/ReportsApi";
import { saveAs } from 'file-saver';
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import StocksReportsTableList from "./StocksReportsTableList";

export default function StocksReportsTable() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [search, setSearch] = useState('');

    const { data: stocks, isLoading } = useQuery({
        queryKey: ['stocks', search, start_date, end_date],
        queryFn: () => reportsApi.getStocks({ search, start_date, end_date }),
        retry: 1,
        keepPreviousData: true
    });

    useEffect(() => {
        if (stocks?.start_date && stocks?.end_date) {
            setStartDate(stocks.start_date);
            setEndDate(stocks.end_date);
        }
    }, [stocks]);

    useEffect(() => {
        if (stocks?.end_date) {
            queryClient.prefetchQuery({
                queryKey: ['stocks', search, start_date, end_date],
                queryFn: () => reportsApi.getStocks({
                    search,
                    start_date,
                    end_date
                })
            });
        }
    }, [stocks, queryClient, start_date, end_date]);

    const rows = [
        { id: 'no', name: 'No', align: 'center', width: '50px' },
        { id: 'history', name: 'History', align: 'left', width: '50px' },
        { id: 'date', name: 'Date', align: 'center', width: '100px' },
        { id: 'code', name: 'Code Product', width: '120px' },
        { id: 'name', name: 'Name Product', width: '100px' },
        { id: 'inQty', name: 'In Qty', align: 'center', width: '100px' },
        { id: 'outQty', name: 'Out Qty', align: 'center', width: '100px' },
        { id: 'total', name: 'Net Total', align: 'center', width: '100px' }
    ];

    const summaryData = useMemo(() => {
        if (!Array.isArray(stocks?.data?.data)) return {};

        return stocks.data.data.reduce((acc, stock) => {
            const itemName = stock.item?.name;
            const itemCode = stock.item?.unique_code;
            if (!itemName || !itemCode) return acc;

            const date = format(new Date(stock.updated_at), "dd-MM-yy");
            const dateKey = format(new Date(stock.updated_at), "MM-yyyy");
            const key = `${itemCode}_${dateKey}`;

            if (!acc[key]) {
                acc[key] = {
                    date: date,
                    unique_code: itemCode,
                    name: itemName,
                    inQty: 0,
                    outQty: 0,
                    transactions: stock.item.transactions,
                };
            }

            acc[key].inQty += Number(stock.qty_in) || 0;
            acc[key].outQty += Number(stock.qty_out) || 0;

            return acc;
        }, {});
    }, [stocks]);

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
            const blob = await reportsApi.getStocksToPdf({ start_date, end_date });
            saveAs(blob, `stocks_report_${start_date}_to_${end_date}.pdf`);
        } catch (error) {
            console.error('Failed to export PDF:', error);
            alert('Failed to export PDF');
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await reportsApi.getStocksToExcel({ start_date, end_date });
            saveAs(blob, `reports_report_${start_date}_to_${end_date}.xlsx`);
        } catch (error) {
            console.error('Failed to export Excel:', error);
            alert('Failed to export Excel');
        }
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} spacing={2} sx={{ mb: 3 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h4">Stoks Reports</Typography>
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
                                    <>
                                        <StocksReportsTableList item={item} index={index} />
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                </TableContainer>
            </Paper>
        </>
    )
}