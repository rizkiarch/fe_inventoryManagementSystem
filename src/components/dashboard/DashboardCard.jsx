import { Grid } from "@mui/material";
import StatCard from "../shared/StartCard";

const DashboardCard = ({ stock, transaction }) => {
    return (
        <>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Transactions In" value={transaction?.transactionsIn} color="primary.main" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Transactions Out" value={transaction?.transactionsOut} color="primary.main" />
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