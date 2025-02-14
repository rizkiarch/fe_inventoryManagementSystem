import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Grid,
    Avatar,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { productApi } from '../../api/ProductApi';
import { FileUploadOutlined } from '@mui/icons-material';

const ProductForm = ({ initialData, onSuccess }) => {
    console.log(initialData);
    const queryClient = useQueryClient();
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [formData, setFormData] = useState({
        unique_code: '',
        name: '',
        description: '',
        is_active: true,
        is_delivery: false,
        photos: [],
    });

    useEffect(() => {
        if (initialData) {

            setFormData({
                unique_code: initialData.unique_code || '',
                name: initialData.name || '',
                description: initialData.description || '',
                is_active: initialData.is_active || '',
                is_delivery: initialData.is_delivery || '',
                photos: [],
            });
            if (initialData.photos && initialData.photos.length > 0) {
                setPhotoPreviews(initialData.photos.map(photo => photo.photo));
            }
        }
    }, [initialData]);

    const productMutation = useMutation({
        mutationFn: (formDataToSend) => {
            if (initialData) {
                return productApi.updateProduct(initialData.id, formDataToSend);
            }
            return productApi.createProduct(formDataToSend);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            onSuccess?.();
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newPhotos = Array.from(files);
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos],
            }));
            const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('unique_code', formData.unique_code || '');
        formDataToSend.append('name', formData.name || '');
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('is_active', formData.is_active ? '1' : '0');
        formDataToSend.append('is_delivery', formData.is_delivery ? '1' : '0');

        formData.photos.forEach(photo => {
            formDataToSend.append('photos[]', photo);
        });

        if (initialData) {
            formDataToSend.append('_method', 'PUT');
        }

        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        productMutation.mutate(formDataToSend);
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                {initialData?.id ? (
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Product Code"
                            name="unique_code"
                            value={formData.unique_code}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                ) : null}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="is_active"
                            value={formData.is_active ? true : false}
                            label="Status"
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                is_active: e.target.value === 'true'
                            }))}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Delivery</InputLabel>
                        <Select
                            name="is_delivery"
                            value={formData.is_delivery ? '1' : '0'}
                            label="Delivery"
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                is_delivery: e.target.value === '1'
                            }))}
                        >
                            <MenuItem value="1">Yes</MenuItem>
                            <MenuItem value="0">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="standard"
                        type="text"
                        InputProps={{
                            endAdornment: (
                                <IconButton component="label">
                                    <FileUploadOutlined />
                                    <input
                                        styles={{ display: "none" }}
                                        type="file"
                                        hidden
                                        onChange={handlePhotoChange}
                                        name="photos[]"
                                        multiple
                                    />
                                </IconButton>
                            ),
                        }}
                        value={formData.photos.map(photo => photo.name).join(', ')}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            variant="outlined"
                            onClick={onSuccess}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={productMutation.isLoading}
                        >
                            {initialData ? 'Update Product' : 'Create Product'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductForm;