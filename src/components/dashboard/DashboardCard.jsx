import { Grid } from "@mui/material";
import StatCard from "../shared/StartCard";

const DashboardCard = ({ userCount, productCount, stock, transaction }) => {
    return (
        <>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Employee" value={userCount?.total_user} color="primary.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Products" value={productCount?.total_product} color="primary.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Stock In" value={stock?.total_qty_in} color="success.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Stock Out" value={stock?.total_qty_out} color="warning.main" />
            </Grid>
        </>
    )
}

export default DashboardCard;