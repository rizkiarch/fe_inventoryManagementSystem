import { api } from "../utils/api";

export const reportsApi = {

    getStocks: async (params = {}) => {
        try {
            const { page, per_page, search, start_date, end_date } = params;
            const response = await api.get('/reports/stock', { params: { page, per_page, search, start_date, end_date } });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch stocks');
        }
    },

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
};