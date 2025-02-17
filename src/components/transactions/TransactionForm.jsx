import { QrCodeScanner } from "@mui/icons-material";
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useCallback, useEffect, useState } from "react";
import { productApi } from "../../api/ProductApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../../api/TransactionsApi";
import { useSnackbar } from "../../context/SnackbarContext";
import TransactionPrintForm from "../ui-components/print/TransactionPrintForm";

const TransactionForm = ({ open, onClose, transactions, role }) => {
    const { showSnackbar } = useSnackbar();
    const [showPrintForm, setShowPrintForm] = useState(false);
    const [transactionData, setTransactionData] = useState(null);
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scanner, setScanner] = useState(null);
    const [formData, setFormData] = useState({
        item_id: '',
        unique_code: '',
        name: '',
        qty_product: '',
        status_product: '',
        qty: '',
        type: '',
        status: '',
    });

    const { data: products, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey: ['products', search],
        queryFn: () => productApi.getProducts({
            search: search

        }),
        retry: 1,
        keepPreviousData: true,
    });

    const TransactionMutation = useMutation({
        mutationFn: (formDataToSend) => {
            const type = formDataToSend.get('type');
            return type === 'in'
                ? transactionsApi.createTransactionIn(formDataToSend)
                : transactionsApi.createTransactionOut(formDataToSend);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('transactions');
            setFormData({
                item_id: '',
                unique_code: '',
                name: '',
                qty: '',
                type: '',
                status: '',
            });
        }
    });

    useEffect(() => {
        console.log("useEffect", scanner);
        return () => {
            if (scanner) {
                scanner.clear();
            }
        }
    }, [scanner]);

    useEffect(() => {
        if (search) {
            queryClient.prefetchQuery({
                queryKey: ['products', search],
                queryFn: () => productApi.getProducts({
                    search: search
                }),
            });
        }
    }, [search, queryClient]);

    const handleScanSuccess = useCallback(async (content, scanner) => {
        try {
            const getProduct = await productApi.getProducts({
                search: content
            });

            const product = getProduct?.data?.find(
                (item) => item.unique_code === content
            );

            if (product) {
                setFormData({
                    ...formData,
                    item_id: product.id,
                    unique_code: product.unique_code,
                    name: product.name,
                    qty_product: product.total_stock,
                    status_product: product.is_active,
                });

                if (scanner) {
                    scanner.clear();
                    setScanner(null);
                    setShowScanner(false);
                }

                queryClient.setQueryData(['products', content], getProduct);
            } else {
                if (scanner) {
                    scanner.clear();
                    setScanner(null);
                    setShowScanner(false);
                }
                showSnackbar('Product not found', 'error');
            }
        } catch (error) {
            console.error('Error scanning product:', error);
            showSnackbar('Product not found', 'error');
        }
    }, [queryClient, showSnackbar, formData]);

    const initializeScanner = useCallback(() => {
        if (!scanner) {
            const newScanner = new Html5QrcodeScanner("reader", {
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 5,
            });
            newScanner.render((result) => handleScanSuccess(result, newScanner));
            setScanner(newScanner);
        }
    }, [scanner, handleScanSuccess]);

    const handleProductSelect = (event, value) => {
        if (value) {
            setFormData({
                ...formData,
                item_id: value.id,
                unique_code: value.unique_code,
                name: value.name,
                qty_product: value.total_stock,
                status_product: value.is_active,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('item_id', formData.item_id);
            formDataToSend.append('qty', formData.qty);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('status', formData.status);

            const response = await TransactionMutation.mutateAsync(formDataToSend);

            if (formData.type === 'out') {
                setTransactionData({
                    ...formData,
                    id: response.data.id,
                });
                setShowPrintForm(true);
            } else {
                onClose();
            }

            if (scanner) {
                scanner.clear();
                setScanner(null);

            }
            setShowScanner(false);

            showSnackbar(response.message, 'success');
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    }

    const handleClose = () => {
        if (scanner) {
            scanner.clear();
            setScanner(null);

        }
        setShowScanner(false);
        setSearch('');

        setFormData({
            item_id: '',
            unique_code: '',
            name: '',
            qty_product: '',
            status_product: '',
            qty: '',
            type: '',
            status: '',
        });

        const readerElement = document.getElementById('reader');
        if (readerElement) {
            readerElement.innerHTML = '';
        }

        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {showScanner ? null : (
                            <Autocomplete
                                options={products?.data || []}
                                onInputChange={(event, newInputValue) => setSearch(newInputValue)}
                                getOptionLabel={(option) => option.name}
                                onChange={handleProductSelect}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Product"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        )}

                        {showScanner ? (
                            <div id="reader" />
                        ) : (
                            <Button
                                variant="outlined"
                                startIcon={<QrCodeScanner />}
                                onClick={() => {
                                    setShowScanner(true);
                                    setTimeout(initializeScanner, 100);
                                }}
                            >
                                Scan QR Code
                            </Button>
                        )}

                        <TextField
                            label="Unique Code"
                            value={formData.unique_code}
                            disabled
                            fullWidth
                            size="small"
                            name="unique_code"
                        />

                        <TextField
                            label="Product Name"
                            value={formData.name}
                            disabled
                            fullWidth
                            size="small"
                            name="name"
                        />

                        <TextField
                            label="QTY Product"
                            value={formData.qty_product}
                            disabled
                            fullWidth
                            size="small"
                            name="qty_product"
                        />

                        <TextField
                            label="Status Product"
                            value={formData.status_product ? 'Active' : 'Inactive'}
                            disabled
                            fullWidth
                            size="small"
                            name="status_product"
                        />

                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="type">Type</InputLabel>
                            <Select
                                labelId="type"
                                id="type"
                                value={formData.type}
                                label="type"
                                name="type"
                                required
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    type: e.target.value
                                }))}
                            >
                                <MenuItem value="in">In</MenuItem>
                                <MenuItem value="out">Out</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                labelId="status"
                                defaultValue="pending"
                                id="status"
                                name="status"
                                value={formData.status}
                                label="Status"
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value
                                }))}
                                required
                            >
                                {role === '["user"]' && formData.type === "in" ? <MenuItem key="pending" value="pending" selected>Pending</MenuItem>
                                    : [
                                        <MenuItem key="cancelled" value="cancelled">Cancelled</MenuItem>,
                                        <MenuItem key="pending" value="pending">Pending</MenuItem>,
                                        <MenuItem key="success" value="success">Approved</MenuItem>
                                    ]}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Quantity"
                            type="number"
                            name="qty"
                            value={formData.qty}
                            onChange={(e) => setFormData({
                                ...formData,
                                qty: parseInt(e.target.value) || ''
                            })}
                            inputProps={{ min: 1 }}
                            fullWidth
                            size="small"
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.item_id || !formData.qty}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {showPrintForm && (
                <TransactionPrintForm
                    open={showPrintForm}
                    onClose={() => {
                        setShowPrintForm(false);
                        onClose();
                    }}
                    transactionData={transactionData}
                />
            )}
        </>
    )
};
export default TransactionForm;