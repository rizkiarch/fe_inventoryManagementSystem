import { Delete, Edit, Print } from "@mui/icons-material";
import { Box, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, TableCell, TableRow } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from 'prop-types';
import { transactionsApi } from "../../api/TransactionsApi";
import { useSnackbar } from "../../context/SnackbarContext";
import TransactionPrintForm from "../ui-components/print/TransactionPrintForm";
import { useState } from "react";

const TransactionList = ({ transaction, width, no, role }) => {
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [showPrintForm, setShowPrintForm] = useState(false);

    const transactionMutation = useMutation({
        mutationFn: async (data) => {
            return data.status === 'cancelled'
                ? transactionsApi.cancelTransaction(data.id)
                : transactionsApi.approveTransaction(data.id);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries('transactions');
            showSnackbar(response.message, 'success');
        },
        onError: (error) => {
            showSnackbar(error.message, 'error');
        },
    });

    const handleChange = (event) => {
        transactionMutation.mutate({
            id: transaction.id,
            status: event.target.value
        });
    };

    const handlePrintForm = () => {
        if (transaction.status === 'pending') {
            showSnackbar('Cannot print pending transactions', 'warning');
            return;
        }
        setShowPrintForm(true);
    };

    const printData = {
        id: transaction.id,
        unique_code: transaction.item?.unique_code,
        name: transaction.item?.name,
        qty: transaction.qty,
        status: transaction.status,
        type: transaction.type
    };

    const statusComponent = () => {
        switch (true) {
            case role.includes("user"):
                return (
                    <Chip
                        label={transaction?.status}
                        color={transaction?.status === "cancelled" ? "error" : transaction?.status === "success" ? "success" : "default"}
                    />
                );
            case transaction?.status === 'cancelled':
                return (
                    <Chip
                        label={transaction?.status}
                        color="error"
                    />
                );
            case transaction?.status === 'success':
                return (
                    <Chip
                        label="approve"
                        color="success"
                    />
                )
            default:
                return (
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="status">Status</InputLabel>
                        <Select
                            labelId="status"
                            id="demo-select-small"
                            value={transaction?.status}
                            label="Status"
                            onChange={handleChange}
                        >
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem disabled value="pending">Pending</MenuItem>
                            <MenuItem value="success">Approve</MenuItem>
                        </Select>
                    </FormControl>
                );
        }
    }
    return (
        <>
            <TableRow key={transaction?.id}>
                {width.map((column) => {
                    const value = (() => {
                        switch (column.id) {
                            case 'no':
                                return no;
                            case 'code':
                                return transaction?.item?.unique_code;
                            case 'name':
                                return transaction?.item?.name;
                            case 'qty':
                                return transaction?.qty;
                            case 'type':
                                return (
                                    <Chip
                                        label={transaction?.type
                                            ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()
                                            : ''
                                        }
                                        color={transaction?.type === "in" ? "success" : "error"}
                                    />
                                );
                            case 'status':
                                return (
                                    statusComponent()
                                )
                            case 'actions':
                                return (
                                    <Box display="flex" justifyContent="end">
                                        <IconButton
                                            color="secondary"
                                            size="small"
                                            onClick={handlePrintForm}
                                        >
                                            <Print />
                                        </IconButton>

                                    </Box>
                                );
                            default:
                                return '';
                        }
                    })();

                    return (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                                width: column.width,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {value}
                        </TableCell>
                    );
                })}
            </TableRow>

            {showPrintForm && (
                <TransactionPrintForm
                    open={showPrintForm}
                    onClose={() => setShowPrintForm(false)}
                    transactionData={printData}
                />
            )}
        </>

    );
};
TransactionList.propTypes = {
    transaction: PropTypes.object.isRequired,
    width: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        align: PropTypes.string,
        width: PropTypes.number
    })).isRequired,
    no: PropTypes.number.isRequired,
    role: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TransactionList;