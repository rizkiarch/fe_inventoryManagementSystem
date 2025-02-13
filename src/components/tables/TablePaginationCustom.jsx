import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";

export default function TablePaginationCustom({ length, onChange }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        onChange(page, rowsPerPage);
    }, [page, rowsPerPage, onChange]);


    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, { label: "All", value: length }]}
            component="div"
            count={length || 0}
            rowsPerPage={rowsPerPage}
            page={Math.min(page, Math.ceil(length / rowsPerPage) - 1)}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
}