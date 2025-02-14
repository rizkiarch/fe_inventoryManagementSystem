import { Close, Download, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, MobileStepper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../utils/api";
import SwipeableViews from "react-swipeable-views";

const QrCodeDialog = ({ open, onClose, product }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);


    useEffect(() => {
        if (open && product) {
            generateQrCode();
            setActiveStep(0);
        }
    }, [open, product]);

    const generateQrCode = async () => {
        if (!product) return;

        setLoading(true);
        setError(null);

        try {
            // const qrData = JSON.stringify({
            //     id: product.id,
            //     name: product.name,
            //     code: product.unique_code
            // });

            const qrData = product.unique_code;

            const response = await api.get('/qr-generate', {
                params: { data: qrData },
                responseType: 'blob'
            });

            const blobUrl = URL.createObjectURL(response.data);
            setQrCodeUrl(blobUrl);
        } catch (err) {
            console.error('Failed to generate QR code:', err);
            setError('Failed to generate QR code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!qrCodeUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `${product.name}_QRCode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClose = () => {
        // Clean up the blob URL when closing the dialog
        if (qrCodeUrl) {
            URL.revokeObjectURL(qrCodeUrl);
            setQrCodeUrl(null);
        }
        onClose();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) =>
            prevActiveStep + 1 < (product?.photos?.length || 0) ? prevActiveStep + 1 : 0
        );
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) =>
            prevActiveStep - 1 >= 0 ? prevActiveStep - 1 : (product?.photos?.length || 1) - 1
        );
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    if (!product) return null;
    const maxSteps = product?.photos?.length || 0;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
            }}>
                <Typography variant="h6">QR Code: {product.name}</Typography>
                <IconButton color="inherit" onClick={handleClose} edge="end">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Product info section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Product Details</Typography>
                        <Typography><strong>Name:</strong> {product.name}</Typography>
                        <Typography><strong>Code:</strong> {product.unique_code}</Typography>
                        {product.description && (
                            <Typography><strong>Description:</strong> {product.description}</Typography>
                        )}
                    </Grid>

                    {/* QR Code section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                p: 3,
                                minHeight: 300,
                                justifyContent: 'center'
                            }}
                        >
                            {loading ? (
                                <CircularProgress />
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : qrCodeUrl ? (
                                <>
                                    <Box
                                        component="img"
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        startIcon={<Download />}
                                        onClick={handleDownload}
                                        sx={{ mt: 2 }}
                                    >
                                        Download QR Code
                                    </Button>
                                </>
                            ) : (
                                <Typography color="text.secondary">No QR code available</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Photos section with carousel */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}
                        >
                            <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                Product Images
                            </Typography>

                            {product.photos && product.photos.length > 0 ? (
                                <Box sx={{ flex: 1, position: 'relative' }}>
                                    <SwipeableViews
                                        axis="x"
                                        index={activeStep}
                                        onChangeIndex={handleStepChange}
                                        enableMouseEvents
                                    >
                                        {product.photos.map((photo, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    height: 250
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={`${import.meta.env.VITE_API_STORAGE_URL}/${photo.photo}`}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    sx={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </SwipeableViews>

                                    <MobileStepper
                                        steps={maxSteps}
                                        position="static"
                                        activeStep={activeStep}
                                        sx={{
                                            borderTop: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                        nextButton={
                                            <Button
                                                size="small"
                                                onClick={handleNext}
                                                disabled={maxSteps === 0}
                                            >
                                                Next
                                                <KeyboardArrowRight />
                                            </Button>
                                        }
                                        backButton={
                                            <Button
                                                size="small"
                                                onClick={handleBack}
                                                disabled={maxSteps === 0}
                                            >
                                                <KeyboardArrowLeft />
                                                Back
                                            </Button>
                                        }
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 3
                                    }}
                                >
                                    <Typography color="text.secondary">No images available</Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default QrCodeDialog;