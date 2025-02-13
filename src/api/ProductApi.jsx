import { api, storage } from "../utils/api";

export const productApi = {
    // Get all products
    getProducts: async (params = {}) => {
        try {
            const { page, per_page, search } = params;
            const response = await api.get('/products', { params: { page, per_page, search } });
            return response.data.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch products');
        }
    },

    // Get single product by ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch product');
        }
    },

    // Create new product
    createProduct: async (productData) => {
        try {
            const response = await api.post('/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to create product');
        }
    },

    // Update existing product
    updateProduct: async (id, productData) => {
        try {
            productData.append('_method', 'PUT');
            const response = await api.put(`/products/${id}`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to update product');
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to delete product');
        }
    },

    getProductImage: async (imagePath) => {
        try {
            if (!imagePath) throw new Error('Image path is required');
            return `${storage}/${imagePath}`;

            // const response = await storage.get(`/${imagePath}`);
            // return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch product image');
        }
    },
};