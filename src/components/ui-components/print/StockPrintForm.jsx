import { forwardRef, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useSnackbar } from '../../../context/SnackbarContext';
import { api } from '../../../utils/api';

const PrintableStockCard = forwardRef(({ data, qrCodeUrl }, ref) => {
    const stockCardNumber = `STK-${new Date().getFullYear()}${String(data.id).padStart(4, '0')}`;

    return (
        <Box ref={ref} sx={{ p: 4, minWidth: 600, maxWidth: 800 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        STOCK CARD
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {stockCardNumber}
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">PT Putra Prima Glosia</Typography>
                    <Typography color="text.secondary">
                        Cargloss Factory, Jl. Lanbau KM. 2, Sanja, Kec. Citeureup,
                    </Typography>
                    <Typography color="text.secondary">
                        Bogor, Jawa Barat 16810
                    </Typography>
                </Box>

            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Details */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Product Information</Typography>
                <Box sx={{
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 3,
                        flex: 1
                    }}>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Product Code
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {data.unique_code}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Product Name
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {data.name}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Current Stock
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {data.total_stock} units
                            </Typography>
                        </Box>
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Report Date
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {format(new Date(), 'dd MMMM yyyy')}
                            </Typography>
                        </Box>
                    </Box>
                    {qrCodeUrl && (
                        <Box sx={{ ml: 3 }}>
                            <img src={qrCodeUrl} alt="QR Code" style={{ width: 100, height: 100 }} />
                        </Box>
                    )}
                </Box>
            </Box>


            {/* Transaction History */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Transaction History</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Stock In</TableCell>
                            <TableCell align="right">Stock Out</TableCell>
                            <TableCell align="right">Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
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

            {/* Footer */}
            <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px dashed grey.300' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    This document was generated on {format(new Date(), 'dd MMMM yyyy HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    This is an automatically generated stock card. No signature is required.
                </Typography>
            </Box>
        </Box>
    );
});

PrintableStockCard.displayName = 'PrintableStockCard';

const StockPrintForm = ({ open, onClose, product }) => {
    const { showSnackbar } = useSnackbar();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPrintReady, setIsPrintReady] = useState(false);
    const componentRef = useRef();

    const generateQrCode = async () => {
        if (!product) return;

        setLoading(true);
        setError(null);

        try {
            const qrData = product.unique_code;
            const response = await api.get('/qr-generate', {
                params: { data: qrData },
                responseType: 'blob'
            });

            const blobUrl = URL.createObjectURL(response.data);
            setQrCodeUrl(blobUrl);
            setIsPrintReady(true); // Set print ready setelah QR code di-generate
        } catch (err) {
            showSnackbar('Failed to generate QR code. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        // content: () => componentRef.current,
        documentTitle: `Stock_Card_${product?.unique_code}_${format(new Date(), 'yyyyMMdd')}`,
    });

    useEffect(() => {
        if (open && product) {
            setIsPrintReady(false);
            generateQrCode();
        }

        return () => {
            if (qrCodeUrl) {
                URL.revokeObjectURL(qrCodeUrl);
            }
            setIsPrintReady(false);
        };
    }, [open, product]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: '60vh' }
            }}
        >
            <DialogTitle>Stock Card Preview</DialogTitle>
            <DialogContent>
                <PrintableStockCard
                    ref={componentRef}
                    data={product}
                    qrCodeUrl={qrCodeUrl}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button variant="contained" onClick={handlePrint}>
                    Print Stock Card
                </Button>
            </DialogActions>
        </Dialog>
    );
};

StockPrintForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
};

export default StockPrintForm;