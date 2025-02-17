import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider } from "@mui/material";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../utils/api";
import { useReactToPrint } from "react-to-print";
import PropTypes from 'prop-types';
import { useSnackbar } from "../../../context/SnackbarContext";

const PrintableContent = forwardRef(({ data, qrCodeUrl }, ref) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(data.id).padStart(4, '0')}`;

    return (
        <Box ref={ref} sx={{ p: 4, minWidth: 600, maxWidth: 800 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        INVOICE
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {invoiceNumber}
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

            {/* Transaction Details */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Transaction Date
                    </Typography>
                    <Typography>
                        {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Status
                    </Typography>
                    <Typography sx={{
                        textTransform: 'uppercase',
                        color: data.status === 'success' ? 'success.main' :
                            data.status === 'pending' ? 'warning.main' : 'error.main'
                    }}>
                        {data.status}
                    </Typography>
                </Box>
                {qrCodeUrl && (
                    <Box>
                        <img src={qrCodeUrl} alt="QR Code" style={{ width: 100, height: 100 }} />
                    </Box>
                )}
            </Box>

            {/* Product Details */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Product Details</Typography>
                <Box sx={{
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2
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
                            Quantity
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {data.qty} units
                        </Typography>
                    </Box>
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            Transaction Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', textTransform: 'uppercase' }}>
                            {data.type}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px dashed grey.300' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    This is an automatically generated invoice. No signature is required.
                </Typography>
            </Box>
        </Box>
    );
});

PrintableContent.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number,
        unique_code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        qty: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    qrCodeUrl: PropTypes.string,
};

PrintableContent.displayName = 'PrintableContent';

const TransactionPrintForm = ({ open, onClose, transactionData }) => {
    const { showSnackbar } = useSnackbar();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPrintReady, setIsPrintReady] = useState(false);
    const componentRef = useRef(null);

    const generateQrCode = async () => {
        if (!transactionData) return;

        setLoading(true);
        setError(null);

        try {
            const qrData = transactionData.unique_code;
            const response = await api.get('/qr-generate', {
                params: { data: qrData },
                responseType: 'blob'
            });

            const blobUrl = URL.createObjectURL(response.data);
            setQrCodeUrl(blobUrl);
            setIsPrintReady(true);
        } catch (err) {
            showSnackbar('Failed to generate QR code. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Transaction Invoice',
    });

    useEffect(() => {
        if (open && transactionData) {
            setIsPrintReady(false);
            generateQrCode();
        }

        return () => {
            if (qrCodeUrl) {
                URL.revokeObjectURL(qrCodeUrl);
            }
            setIsPrintReady(false);
        };
    }, [open, transactionData]);

    // Render konten hanya jika data sudah siap
    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        if (!transactionData || !isPrintReady) {
            return <Typography>Preparing document...</Typography>;
        }

        return (
            <div style={{ display: isPrintReady ? 'block' : 'none' }}>
                <PrintableContent
                    ref={componentRef}
                    data={transactionData}
                    qrCodeUrl={qrCodeUrl}
                />
            </div>
        );
    };

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
            <DialogTitle>Transaction Invoice</DialogTitle>
            <DialogContent>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button
                    variant="contained"
                    onClick={handlePrint}
                    disabled={loading || !!error || !isPrintReady}
                >
                    Print Invoice
                </Button>
            </DialogActions>
        </Dialog>
    );
};


TransactionPrintForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transactionData: PropTypes.object.isRequired,
};

export default TransactionPrintForm;