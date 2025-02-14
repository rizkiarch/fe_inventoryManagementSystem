import { Container, Toolbar } from "@mui/material";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TransactionTable from "../../components/transactions/TransactionTable";

export default function TransactionsPage() {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth="lg">
                <TransactionTable />
            </Container>
        </DashboardLayout>
    );
}