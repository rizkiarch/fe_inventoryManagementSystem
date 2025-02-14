import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteDialog = ({ open, onClose, onDelete, itemName }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{
                bgcolor: 'warning.light',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <WarningAmberIcon color="warning" />
                <Typography variant="h6">Delete {itemName}</Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <DialogContentText>
                    Are you sure you want to delete <b>{itemName}</b>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={onDelete}
                    color="error"
                    variant="contained"
                    startIcon={<DeleteOutlineIcon />}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;