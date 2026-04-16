import { Box, Paper, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import { formatINR } from '../utils/format';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: row.color }} />
        <Typography variant="subtitle2" fontWeight={700}>
          {row.category}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block">
        {formatINR(row.value)} · {row.percentage}%
      </Typography>
    </Paper>
  );
}

export default function CategoryPieChart({ data, loading }) {
  const items = data?.data ?? [];
  const total = data?.totalRevenue ?? items.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard
      title={data?.chartTitle ?? 'Revenue by Category'}
      subtitle="Current month distribution"
      loading={loading}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ height: '100%' }}>
        <Box sx={{ flex: 1, minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="category"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="none"
              >
                {items.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Stack spacing={1.25} sx={{ flex: 1, justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Total revenue
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: -0.5, mb: 1 }}>
            {formatINR(total)}
          </Typography>
          {items.map((item) => (
            <Stack
              key={item.category}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="body2" noWrap>
                  {item.category}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {item.percentage}%
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </ChartCard>
  );
}
