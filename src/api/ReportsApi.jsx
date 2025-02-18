import { api } from "../utils/api";

export const reportsApi = {

    getTransactions: async (params = {}) => {
        try {
            const { page, per_page, search, start_date, end_date } = params;
            const response = await api.get('/reports/transaction', { params: { page, per_page, search, start_date, end_date } });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch transactions');
        }
    },

    exportTransactionsToPdf: async (params = {}) => {
        try {
            const { start_date, end_date } = params;
            const response = await api.get('/reports/transaction/export-pdf', {
                params: { start_date, end_date },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to export PDF');
        }
    },

    exportTransactionsToExcel: async (params = {}) => {
        try {
            const { start_date, end_date } = params;
            const response = await api.get('/reports/transaction/export-excel', {
                params: { start_date, end_date },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to export Excel');
        }
    },

    getStocks: async (params = {}) => {
        try {
            const { page, per_page, search, start_date, end_date } = params;
            const response = await api.get('/reports/stock', { params: { page, per_page, search, start_date, end_date } });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch stocks');
        }
    },

    getStocksToPdf: async (params = {}) => {
        try {
            const { start_date, end_date } = params;
            const response = await api.get('/reports/stock/export-pdf', {
                params: { start_date, end_date },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to export PDF');
        }
    },

    getStocksToExcel: async (params = {}) => {
        try {
            const { start_date, end_date } = params;
            const response = await api.get('/reports/stock/export-excel', {
                params: { start_date, end_date },
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to export Excel');
        }
    },

    getProductCount: async () => {
        try {
            const response = await api.get('/reports/product/count');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch product count');
        }
    },

    getUserCount: async () => {
        try {
            const response = await api.get('/reports/user/count');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch user count');
        }
    },

    getAnalisisAI: async () => {
        try {
            const response = await api.get('/gemini/results/latest');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch analysis');
        }
    },

};