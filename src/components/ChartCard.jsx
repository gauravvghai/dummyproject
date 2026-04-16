import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

export default function ChartCard({ title, subtitle, loading, height = 340, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 2 }} />
        ) : (
          <Box sx={{ height }}>{children}</Box>
        )}
      </CardContent>
    </Card>
  );
}
