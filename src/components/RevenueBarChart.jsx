import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Paper, Stack, Typography } from '@mui/material';
import ChartCard from './ChartCard';
import { formatINR } from '../utils/format';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2, minWidth: 180 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {label}
      </Typography>
      <Stack spacing={0.5}>
        <Row label="Revenue" value={formatINR(row.revenue)} color="#1976d2" />
        <Row label="Target" value={formatINR(row.target)} color="#90caf9" />
        <Row label="Orders" value={row.orders} />
      </Stack>
    </Paper>
  );
}

function Row({ label, value, color }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {color && (
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        )}
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function RevenueBarChart({ data, loading }) {
  return (
    <ChartCard
      title={data?.chartTitle ?? 'Monthly Revenue Trend'}
      subtitle="Revenue vs target — last 6 months"
      loading={loading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data?.data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(v) => formatINR(v, { compact: true })}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(25,118,210,0.06)' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="target" name="Target" fill="#bbdefb" radius={[6, 6, 0, 0]} barSize={18} />
          <Bar dataKey="revenue" name="Revenue" fill="#1976d2" radius={[6, 6, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
