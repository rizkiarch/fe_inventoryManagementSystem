import { Alert, Snackbar } from "@mui/material";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { useMemo, useState } from "react";

export const SnackbarProvider = ({ children }) => {
    const [state, setState] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showSnackbar = (message, severity = 'success') => {
        setState({
            open: true,
            message,
            severity,
        });
    };

    const hideSnackbar = () => {
        setState((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const value = useMemo(
        () => ({
            showSnackbar,
            hideSnackbar,
        }),
        []
    );

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                open={state.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={state.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};