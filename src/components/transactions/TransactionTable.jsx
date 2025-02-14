import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import TableSkeleton from "../skeletons/TableSkeleton";
import TableHeader from "../tables/TableHeader";
import TablePaginationCustom from "../tables/TablePaginationCustom";
import { Search } from "@mui/icons-material";

export default function TransactionTable() {

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
            id: 'qty',
            name: 'QTY',
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
            id: 'actions',
            name: 'Actions',
            align: 'center',
            width: '150px'
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
                            // options={products?.data?.map((product) => product.name) || []}
                            // onInputChange={(event, newInputValue) => setSearch(newInputValue)}
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
                    // onClick={() => {
                    //     setSelectedProduct(null);
                    //     setOpenModal(true);
                    // }}
                    >
                        Add New Transactions
                    </Button>
                </Stack>
                <TableContainer sx={{ minHeight: 440, maxHeight: 440 }} >
                    {/* {isLoading ? (
                        <TableSkeleton rowCount={rows?.rows?.length} />
                    ) : ( */}
                    <Table sx={{ tableLayout: "fixed", width: "100%" }} stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableHeader rows={rows} />
                        </TableHead>
                        <TableBody>
                            {/* {products?.data?.length > 0 ? (
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
                                                No transactions found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )} */}
                        </TableBody>
                    </Table>
                    {/* )} */}
                </TableContainer>
                {/* <TablePaginationCustom
                length={products?.total}
                onChange={(newPage, newRowsPerPage) => {
                    setPage(newPage);
                    setRowsPerPage(newRowsPerPage);
                }} 
                /> */}
            </Paper>
            <Dialog
                // open={openModal}
                // onClose={() => setOpenModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {/* {selectedProduct ? 'Edit Product' : 'Add New Product'} */}
                </DialogTitle>
                <DialogContent>
                    {/* <ProductForm
                        initialData={selectedProduct}
                        onSuccess={() => {
                            setOpenModal(false);
                            setSelectedProduct(null);
                        }}
                    /> */}
                </DialogContent>
            </Dialog>
        </>
    );
}