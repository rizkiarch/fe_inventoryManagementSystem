import { useState } from 'react';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Chip,
    Divider,
    IconButton,
    ListItemSecondaryAction
} from "@mui/material";
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DashboardRecent = ({ recent }) => {
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(5);

    const formatActivity = (activity) => {
        const date = format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm');
        const isStockIn = activity.type === 'in';

        return {
            id: activity.id,
            productName: activity.item.name,
            quantity: activity.qty,
            type: activity.type,
            date,
            isStockIn
        };
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 360,
                bgcolor: 'background.paper',
                borderRadius: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                    component="h2"
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        flex: 1
                    }}
                >
                    Recent Activity
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List sx={{ overflow: 'auto', flex: 1, my: -1 }}>
                {recent?.data?.slice(0, displayCount).map((activity) => {
                    const {
                        id,
                        productName,
                        quantity,
                        date,
                        isStockIn
                    } = formatActivity(activity);

                    return (
                        <ListItem
                            key={id}
                            sx={{
                                py: 1.5,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderRadius: 1
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {productName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(activity.created_at), 'dd MM yy')}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {quantity} units {isStockIn ? 'added to' : 'removed from'} inventory
                                    </Typography>
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>

            {/* {recent?.data?.length > displayCount && ( */}
            <Button
                variant="text"
                color="primary"
                sx={{
                    mt: 2,
                    textTransform: 'none',
                    fontWeight: 600
                }}
                onClick={() => navigate('/dashboard/transactions')}
            >
                Load More Activities
            </Button>
            {/* )} */}
        </Paper>
    );
};

export default DashboardRecent;