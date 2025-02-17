import { useSnackbar } from "./useSnackBar";

export const useSnackbarHandler = () => {
    const { showSnackbar } = useSnackbar();

    const handleApiResponse = (response) => {
        if (response.success) {
            showSnackbar(response.message, 'success');
        } else {
            showSnackbar(response.message || 'An error occurred', 'error');
        }
    };

    const handleError = (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        showSnackbar(message, 'error');
    };

    return {
        handleApiResponse,
        handleError,
        showSnackbar,
    };
};