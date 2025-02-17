import { Container, Toolbar } from "@mui/material";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TransactionsReportsTable from "../../components/reports/transactions/TransactionsReportsTable";

export default function TransactionsReportsPage() {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth="lg">
                <TransactionsReportsTable />
            </Container>
        </DashboardLayout>
    )
}