import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    Box,
    useTheme,
} from '@mui/material';
import { BarChart2, LineChart, Target, Shield, Layers, Package } from 'lucide-react';

const DashboardAnalysis = ({ AnalisisAI }) => {
    const theme = useTheme();
    const response = AnalisisAI?.data?.response || '';
    const prompt = AnalisisAI?.data?.prompt || '';

    // Parse the summary data
    const summaryMatch = prompt.match(/### 📊 \*\*Ringkasan Data\*\*\s*✅ \*\*Total Produk Masuk:\*\* ([\d,]+) unit\s*✅ \*\*Total Produk Keluar:\*\* ([\d,]+) unit\s*✅ \*\*Sisa Stok Saat Ini:\*\* ([\d,]+) unit/);
    const summaryData = summaryMatch ? {
        masuk: summaryMatch[1],
        keluar: summaryMatch[2],
        sisa: summaryMatch[3]
    } : { masuk: 0, keluar: 0, sisa: 0 };

    // Split response into sections based on headers
    const sections = [
        {
            title: "1. Analisis Performa Inventory",
            content: response.split('1️⃣ **Tren Inventory:**')[1]?.split('2️⃣ **')[0] || ''
        },
        {
            title: "2. Insight Terkait Perputaran Barang",
            content: response.split('2️⃣ **Insight Performa:**')[1]?.split('3️⃣ **')[0] || ''
        },
        {
            title: "3. Rekomendasi Strategis untuk Optimasi Stok",
            content: response.split('3️⃣ **Optimalisasi Stok:**')[1]?.split('4️⃣ **')[0] || ''
        },
        {
            title: "4. Potensi Risiko dan Peluang",
            content: response.split('4️⃣ **Risiko & Peluang:**')[1]?.split('5️⃣ **')[0] || ''
        },
        {
            title: "5. KPI Utama",
            content: response.split('5️⃣ **KPI Utama:**')[1]?.split('6️⃣ **')[0] || ''
        },
        {
            title: "6. Strategi Ke Depan",
            content: response.split('6️⃣ **Strategi Ke Depan:**')[1]?.split('### 📋 **Kesimpulan**')[0] || ''
        },
        {
            title: "7. Kesimpulan",
            content: response.split('### 📋 **Kesimpulan**')[1]?.split('**5️⃣')[0] || '',
            fullWidth: true
        }
    ];

    // Get icon for each section
    const getIcon = (title) => {
        const iconStyle = { width: 24, height: 24, color: theme.palette.primary.main };
        switch (title) {
            case "1. Analisis Performa Inventory":
                return <BarChart2 style={iconStyle} />;
            case "2. Insight Terkait Perputaran Barang":
                return <LineChart style={iconStyle} />;
            case "3. Rekomendasi Strategis untuk Optimasi Stok":
                return <Target style={iconStyle} />;
            case "4. Potensi Risiko dan Peluang":
                return <Shield style={iconStyle} />;
            case "5. KPI Utama":
                return <Package style={iconStyle} />;
            default:
                return <Layers style={iconStyle} />;
        }
    };

    const renderContent = (content) => {
        return content.split('*').map((point, idx) => {
            if (point.trim().startsWith('*')) {
                return (
                    <Box
                        key={idx}
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            mb: 2,
                            ml: 1
                        }}
                    >
                        <Typography
                            variant="body2"
                            component="span"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                mt: 0.5
                            }}
                        >
                            •
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.8
                            }}
                        >
                            {point.replace(/\*/g, '').trim()}
                        </Typography>
                    </Box>
                );
            }
            return (
                <Typography
                    key={idx}
                    variant="body2"
                    paragraph
                    sx={{
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        mb: 2
                    }}
                >
                    {point.trim()}
                </Typography>
            );
        });
    };

    return (
        <Paper
            elevation={3}
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        mb: 3
                    }}
                >
                    Laporan Analisis AI - Pergerakan Produk
                </Typography>

                {/* Summary Stats */}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Package size={20} />
                                <Typography variant="subtitle2">Total Stock Masuk</Typography>
                            </Box>
                            <Typography variant="h4">{summaryData.masuk}</Typography>
                            <Typography variant="caption">unit</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'warning.light',
                                color: 'warning.contrastText',
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Package size={20} />
                                <Typography variant="subtitle2">Total Stock Keluar</Typography>
                            </Box>
                            <Typography variant="h4">{summaryData.keluar}</Typography>
                            <Typography variant="caption">unit</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                borderRadius: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Package size={20} />
                                <Typography variant="subtitle2">Sisa Stok</Typography>
                            </Box>
                            <Typography variant="h4">{summaryData.sisa}</Typography>
                            <Typography variant="caption">unit</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 3,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.grey[100],
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[400],
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: theme.palette.grey[500],
                        },
                    },
                }}
            >
                <Grid container spacing={3}>
                    {sections.map((section, index) => (
                        <Grid item xs={12} md={section.fullWidth ? 12 : 6} key={index}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4],
                                    },
                                    borderRadius: 1.5,
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 2.5,
                                    pb: 1.5,
                                    borderBottom: 1,
                                    borderColor: 'divider'
                                }}>
                                    {getIcon(section.title)}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'text.primary',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                </Box>

                                <Box sx={{ color: 'text.secondary' }}>
                                    {renderContent(section.content)}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );
};

export default DashboardAnalysis;