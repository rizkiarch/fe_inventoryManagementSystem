import { Container, Toolbar } from "@mui/material";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StockTable from "../../components/stocks/StockTable";

export default function StocksPage() {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth="lg">
                <StockTable />
            </Container>
        </DashboardLayout>
    );
}