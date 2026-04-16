import { Chip } from '@mui/material';

const palette = {
  'In Stock': { color: 'success', variant: 'soft' },
  'Low Stock': { color: 'warning', variant: 'soft' },
  'Out of Stock': { color: 'error', variant: 'soft' },
  Completed: { color: 'success', variant: 'soft' },
  Pending: { color: 'warning', variant: 'soft' },
  Failed: { color: 'error', variant: 'soft' },
};

const bgMap = {
  success: { bg: 'rgba(46, 125, 50, 0.12)', fg: '#2e7d32' },
  warning: { bg: 'rgba(237, 108, 2, 0.14)', fg: '#c77700' },
  error: { bg: 'rgba(211, 47, 47, 0.12)', fg: '#c62828' },
  default: { bg: 'rgba(0,0,0,0.06)', fg: '#424242' },
};

export default function StatusChip({ status }) {
  const { color = 'default' } = palette[status] ?? {};
  const { bg, fg } = bgMap[color] ?? bgMap.default;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: bg,
        color: fg,
        fontWeight: 600,
        borderRadius: 1.5,
        height: 24,
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
}
