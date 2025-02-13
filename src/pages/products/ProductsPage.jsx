import { Container, Toolbar } from "@mui/material";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ProductTable from "../../components/products/ProductTable";

export default function ProductsPage() {
    return (
        <DashboardLayout>
            <Toolbar />
            <Container maxWidth="lg">
                <ProductTable />
            </Container>
        </DashboardLayout>
    );
}