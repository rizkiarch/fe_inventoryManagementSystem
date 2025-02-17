import { api } from "../utils/api";

export const transactionsApi = {
    getTransactions: async (params = {}) => {
        try {
            const { page, per_page, search } = params;
            const response = await api.get('/transactions', { params: { page, per_page, search } });
            return response.data.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch transactions');
        }
    },

    getTransactionById: async (id) => {
        try {
            const response = await api.get(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch transaction');
        }
    },

    createTransactionIn: async (transactionData) => {
        try {
            const response = await api.post('/transactions/in', transactionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to create transaction');
        }
    },

    createTransactionOut: async (transactionData) => {
        try {
            const response = await api.post('/transactions/out', transactionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to create transaction');
        }
    },

    updateTransaction: async (id, transactionData) => {
        try {
            if (transactionData instanceof FormData) {
                transactionData.append('_method', 'PUT');
            }
            const response = await api.put(`/transactions/${id}`, transactionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to update transaction');
        }
    },

    approveTransaction: async (id) => {
        try {
            const response = await api.put(`/transactions/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to approve transaction');
        }
    },

    cancelTransaction: async (id) => {
        try {
            const response = await api.put(`/transactions/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to cancel transaction');
        }
    },
};