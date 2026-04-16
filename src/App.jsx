import { useMemo } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InsightsIcon from '@mui/icons-material/Insights';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import KpiCard from './components/KpiCard';
import RevenueBarChart from './components/RevenueBarChart';
import CategoryPieChart from './components/CategoryPieChart';
import ProductsTable from './components/ProductsTable';
import TransactionsTable from './components/TransactionsTable';

import useFetchData from './hooks/useFetchData';
import {
  fetchCategoryRevenue,
  fetchMonthlyRevenue,
  fetchRecentTransactions,
  fetchTopProducts,
} from './services/api';
import { formatINR, formatNumber, formatToday } from './utils/format';

export default function App() {
  const bar = useFetchData(fetchMonthlyRevenue);
  const pie = useFetchData(fetchCategoryRevenue);
  const products = useFetchData(fetchTopProducts);
  const transactions = useFetchData(fetchRecentTransactions);

  const loading = bar.loading || pie.loading || products.loading || transactions.loading;
  const errors = [bar.error, pie.error, products.error, transactions.error].filter(Boolean);

  const kpis = useMemo(() => {
    const series = bar.data?.data ?? [];
    const current = series[series.length - 1];
    const previous = series[series.length - 2];
    if (!current) return null;

    const growth = previous ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    const totalOrders = current.orders;
    const aov = totalOrders > 0 ? current.revenue / totalOrders : 0;

    return {
      revenue: current.revenue,
      orders: totalOrders,
      aov,
      growth,
      month: current.month,
    };
  }, [bar.data]);

  const handleRefreshAll = () => {
    bar.refetch();
    pie.refetch();
    products.refetch();
    transactions.refetch();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          backdropFilter: 'saturate(180%) blur(8px)',
          bgcolor: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Container maxWidth="xl" disableGutters>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'common.white',
                  }}
                >
                  <InsightsIcon />
                </Box>
                <Stack>
                  <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                    Acme Commerce · Sales Analytics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatToday()}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshAll}
                disabled={loading}
                disableElevation
              >
                {loading ? 'Refreshing…' : 'Refresh data'}
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={handleRefreshAll}>
            {errors[0].message || 'Something went wrong while loading dashboard data.'}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Total Revenue"
              value={kpis ? formatINR(kpis.revenue) : '—'}
              delta={kpis?.growth}
              icon={<PaymentsIcon fontSize="small" />}
              accent="primary.main"
              loading={bar.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Total Orders"
              value={kpis ? formatNumber(kpis.orders) : '—'}
              icon={<ShoppingBagIcon fontSize="small" />}
              accent="#9c27b0"
              loading={bar.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Avg. Order Value"
              value={kpis ? formatINR(kpis.aov) : '—'}
              icon={<ReceiptLongIcon fontSize="small" />}
              accent="#ff9800"
              loading={bar.loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              title="Growth Rate"
              value={kpis ? `${kpis.growth >= 0 ? '+' : ''}${kpis.growth.toFixed(1)}%` : '—'}
              delta={kpis?.growth}
              icon={<TrendingUpIcon fontSize="small" />}
              accent="#2e7d32"
              loading={bar.loading}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <RevenueBarChart data={bar.data} loading={bar.loading} />
          </Grid>
          <Grid item xs={12} md={5}>
            <CategoryPieChart data={pie.data} loading={pie.loading} />
          </Grid>

          <Grid item xs={12} md={7}>
            <ProductsTable data={products.data} loading={products.loading} />
          </Grid>
          <Grid item xs={12} md={5}>
            <TransactionsTable data={transactions.data} loading={transactions.loading} />
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="caption" color="text.secondary">
            Demo data — figures are illustrative and sourced from mocked JSON endpoints.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
