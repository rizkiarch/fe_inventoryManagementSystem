import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, value, color }) => (
    <Card
        sx={{
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3,
            }
        }}
    >
        <CardContent>
            <Typography color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ color }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

export default StatCard;