import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { productApi } from '../api/ProductApi';

const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const queryClient = useQueryClient();

    // Fetch products
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getProducts,
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: productApi.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            alert(error.message || "Failed to delete product");
        }
    });

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProductMutation.mutate(productId);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4">Products</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                >
                    Add New Product
                </Button>
            </Box>

            <ProductList
                products={products || []}
                isLoading={isLoading}
                onDelete={handleDeleteProduct}
            />

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <ProductForm
                        onSuccess={() => {
                            queryClient.invalidateQueries(['products']);
                            setOpenModal(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Products;