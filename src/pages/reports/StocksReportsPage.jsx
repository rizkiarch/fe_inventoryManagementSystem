import { Container, Toolbar } from "@mui/material";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StocksReportsTable from "../../components/reports/stocks/StocksReportsTable";

export default function StocksReportsPage() {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth="lg">
                <StocksReportsTable />
            </Container>
        </DashboardLayout>
    )
}