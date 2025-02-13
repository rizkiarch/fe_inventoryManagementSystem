import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Grid,
    Chip,
    Divider,
    Box
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Label as LabelIcon,
    AttachMoney as MoneyIcon,
    Category as CategoryIcon,
    Stars as StatusIcon
} from '@mui/icons-material';

const ProductDetail = ({ product, open, onClose }) => {
    if (!product) return null;

    const detailItems = [
        {
            icon: <InventoryIcon />,
            label: 'Stock',
            value: product.stock,
            chip: true,
            chipColor: product.stock < 10 ? 'error' : 'success'
        },
        {
            icon: <LabelIcon />,
            label: 'Product Code',
            value: product.code
        },
        {
            icon: <CategoryIcon />,
            label: 'Category',
            value: product.category
        },
        {
            icon: <MoneyIcon />,
            label: 'Price',
            value: `Rp ${product.price.toLocaleString()}`
        },
        {
            icon: <StatusIcon />,
            label: 'Status',
            value: product.status,
            chip: true,
            chipColor: product.status === 'Active' ? 'success' : 'default'
        }
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {product.name}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {detailItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={4} display="flex" alignItems="center" gap={1}>
                                {item.icon}
                                <Typography variant="body2" color="text.secondary">
                                    {item.label}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                {item.chip ? (
                                    <Chip
                                        label={item.value}
                                        color={item.chipColor}
                                        size="small"
                                    />
                                ) : (
                                    <Typography variant="body1">
                                        {item.value}
                                    </Typography>
                                )}
                            </Grid>
                            {index < detailItems.length - 1 && (
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetail;