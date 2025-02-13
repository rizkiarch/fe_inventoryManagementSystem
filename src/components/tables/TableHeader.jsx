import { TableCell, TableRow } from "@mui/material";

export default function TableHeader({ rows }) {
    // Memastikan rows adalah array dan memiliki struktur yang benar
    const normalizedRows = Array.isArray(rows)
        ? rows.map((row, index) => {
            // Jika row adalah string, konversi ke objek
            if (typeof row === 'string') {
                return {
                    id: index,
                    name: row,
                    align: 'left',
                    width: 'auto'
                };
            }
            // Jika row adalah objek, pastikan memiliki properti yang diperlukan
            return {
                id: row.id || index,
                name: row.name || row,
                align: row.align || 'left',
                width: row.width || 'auto'
            };
        })
        : [];

    return (
        <TableRow>
            {normalizedRows.map((row) => (
                <TableCell
                    key={row.id}
                    align={row.align}
                    style={{
                        width: row.width,
                        fontWeight: 'bold'
                    }}
                >
                    {row.name}
                </TableCell>
            ))}
        </TableRow>
    );
}