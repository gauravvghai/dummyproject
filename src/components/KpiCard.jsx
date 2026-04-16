import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function KpiCard({ title, value, delta, icon, accent = 'primary.main', loading }) {
  const isPositive = typeof delta === 'number' ? delta >= 0 : null;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: accent,
              color: 'common.white',
            }}
          >
            {icon}
          </Box>
        </Stack>

        {loading ? (
          <>
            <Skeleton variant="text" width="60%" height={36} />
            <Skeleton variant="text" width="40%" />
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
            {isPositive !== null && (
              <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                )}
                <Typography
                  variant="body2"
                  sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
                >
                  {isPositive ? '+' : ''}
                  {delta.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs last month
                </Typography>
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
