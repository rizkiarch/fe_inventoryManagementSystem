import { useState } from 'react';
import {
    TableCell,
    TableRow,
    IconButton,
    Box,
    Chip,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    Collapse,
    Typography,
    Table,
    TableHead,
    TableBody,
    Button,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    QrCode2 as QrCode,
    KeyboardArrowUp,
    KeyboardArrowDown,
    Print
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../../api/ProductApi';
import ProductForm from './ProductForm';
import DeleteDialog from '../ui-components/dialogs/DeleteDialog';
import QrCodeDialog from '../ui-components/dialogs/QrCodeDialog';
import { useSnackbar } from '../../context/SnackbarContext';
import { format } from 'date-fns';
import StockPrintForm from '../ui-components/print/StockPrintForm';

const ProductList = ({ product, no }) => {
    const API_STORAGE_URL = import.meta.env.VITE_API_STORAGE_URL;
    const QueryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const [openPrintDialog, setOpenPrintDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openQrDialog, setOpenQrDialog] = useState(false);

    const { data: image, isLoading: imageLoading } = useQuery({
        queryKey: ['productImage', product.id, product?.photos?.[0]?.photo],
        queryFn: () => {
            if (!product?.photos?.[0]?.photo) return null;
            return productApi.getProductImage(product.photos[0].photo);
        },
        enabled: !!product?.photos?.[0]?.photo
    });

    const handleDelete = async () => {
        try {
            const response = await productApi.deleteProduct(product.id);
            setOpenDeleteDialog(false);
            showSnackbar(response.message, 'success');
            QueryClient.invalidateQueries(['products']);
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

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

    const processedTransactions = product?.transactions ? processTransactions(product.transactions) : [];

    const handlePrintStockCard = () => {
        setOpenPrintDialog(true);
    };

    const renderImage = () => {
        if (imageLoading) {
            return <Box sx={{ width: 40, height: 40, bgcolor: 'grey.200' }} />;
        }

        if (image) {
            return (
                <Box
                    component="img"
                    src={`${API_STORAGE_URL}/${product.photos[0].photo}`}
                    alt={product.name}
                    loading="lazy"

                    sx={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 1
                    }}
                />
            );
        }

        return (
            <Box
                component="img"
                src="https://placehold.co/200x200?text=No+Image"
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                }}
            />

        );
    };

    return (
        <>
            <TableRow key={product?.id}>
                <TableCell>{no}</TableCell>
                {/* <TableCell>
                    {renderImage()}
                </TableCell> */}
                {/* <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell> */}
                <TableCell>{product?.unique_code}</TableCell>
                <TableCell>{product?.name}</TableCell>
                <TableCell>{product?.description}</TableCell>
                <TableCell>
                    <Chip
                        label={product?.total_stock}
                        color={product?.total_stock < 5 ? 'error' : 'primary'}
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <Switch disabled defaultChecked={product?.is_active === 1} />
                </TableCell>
                <TableCell>{product?.is_delivery === 1 ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                    <Box display="flex" justifyContent="end">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                                setOpenQrDialog(true)
                            }}                           >
                            <QrCode />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            size="small"
                            onClick={() => {
                                setOpenModal(true)
                            }}                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                                setOpenDeleteDialog(true)
                            }}                            >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>

            {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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
            </TableRow > */}

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {product ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <ProductForm
                        initialData={product}
                        onSuccess={() => {
                            setOpenModal(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <QrCodeDialog
                open={openQrDialog}
                onClose={() => setOpenQrDialog(false)}
                product={product}
            />

            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={handleDelete}
                itemName={product?.name} />

            <StockPrintForm
                open={openPrintDialog}
                onClose={() => setOpenPrintDialog(false)}
                product={{
                    ...product,
                    transactions: processedTransactions
                }}
            />
        </>
    );
};

export default ProductList;