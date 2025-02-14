import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productApi } from "../../api/ProductApi";
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import TableHeader from "../tables/TableHeader";
import TablePaginationCustom from "../tables/TablePaginationCustom";
import { Autocomplete, TextField } from "@mui/material";
import TableSkeleton from "../skeletons/TableSkeleton";
import { Search } from "@mui/icons-material";


export default function ProductTable() {
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const queryClient = useQueryClient();

    const { data: products, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey: ['products', page, rowsPerPage, search],
        queryFn: () => productApi.getProducts({
            page: page + 1,
            per_page: rowsPerPage,
            search: search
        }),
        retry: 1,
        keepPreviousData: true,
    });

    useEffect(() => {
        if (products?.next_page_url) {
            queryClient.prefetchQuery({
                queryKey: ['products', page + 2, rowsPerPage, search],
                queryFn: () => productApi.getProducts({
                    page: page + 2,
                    per_page: rowsPerPage,
                    search: search
                }),
            });
        }

    }, [products, page, rowsPerPage, search, queryClient]);

    const rows = [
        {
            id: 'no',
            name: 'No',
            align: 'center',
            width: '50px'
        },
        {
            id: 'photo',
            name: 'Photo',
            align: 'center',
            width: '100px'
        },
        {
            id: 'code',
            name: 'Code',
            width: '120px'
        },
        {
            id: 'name',
            name: 'Name',
            width: '150px'
        },
        {
            id: 'description',
            name: 'Description'
        },
        {
            id: 'stock',
            name: 'Stock',
            align: 'center',
            width: '80px'
        },
        {
            id: 'status',
            name: 'Status',
            align: 'center',
            width: '100px'
        },
        {
            id: 'delivery',
            name: 'Delivery',
            align: 'center',
            width: '100px'
        },
        {
            id: 'actions',
            name: 'Actions',
            align: 'center',
            width: '150px'
        }
    ];

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4">Products</Typography>

                    <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                        <Autocomplete
                            freeSolo
                            options={products?.data?.map((product) => product.name) || []}
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
                        onClick={() => {
                            setSelectedProduct(null);
                            setOpenModal(true);
                        }}
                    >
                        Add New Product
                    </Button>
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
                                {products?.data?.length > 0 ? (
                                    products?.data?.map((product, index) => (
                                        <ProductList
                                            key={product.id}
                                            product={product}
                                            no={(page * rowsPerPage) + index + 1}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={rows.length} align="center">
                                            <Typography variant="h6" color="textSecondary">
                                                No products found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}

                </TableContainer>
                <TablePaginationCustom
                    length={products?.total}
                    onChange={(newPage, newRowsPerPage) => {
                        setPage(newPage);
                        setRowsPerPage(newRowsPerPage);
                    }} />
            </Paper>
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <ProductForm
                        initialData={selectedProduct}
                        onSuccess={() => {
                            setOpenModal(false);
                            setSelectedProduct(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}