import React, { useEffect, useState } from 'react';
import {
    TableCell,
    TableRow,
    IconButton,
    Box,
    Chip,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    QrCode2 as QrCode
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../../api/ProductApi';
import ProductForm from './ProductForm';
import DeleteDialog from '../ui-components/dialogs/DeleteDialog';
import QrCodeDialog from '../ui-components/dialogs/QrCodeDialog';

const ProductList = ({ product, no }) => {
    const API_STORAGE_URL = import.meta.env.VITE_API_STORAGE_URL;
    const QueryClient = useQueryClient();

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
            await productApi.deleteProduct(product.id);
            setOpenDeleteDialog(false);
            QueryClient.invalidateQueries(['products']);
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
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
                <TableCell>
                    {renderImage()}
                </TableCell>
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
        </>
    );
};

export default ProductList;