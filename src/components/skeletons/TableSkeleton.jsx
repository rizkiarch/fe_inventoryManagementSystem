import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton } from "@mui/material";

export default function TableSkeleton({ rowCount = 5, columnWidths = [80, 200, 150, 120, 100] }) {
    return (
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
                <TableRow>
                    {columnWidths.map((width, index) => (
                        <TableCell key={index} sx={{ width: width }}>
                            <Skeleton variant="text" width="80%" />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {[...Array(rowCount)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columnWidths.map((width, colIndex) => (
                            <TableCell key={colIndex} sx={{ width: width }}>
                                <Skeleton variant="rectangular" width="100%" height={40} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
