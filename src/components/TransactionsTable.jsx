import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import StatusChip from './StatusChip';
import { formatDateTime, formatINR } from '../utils/format';

const initials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const avatarColor = (seed = '') => {
  const colors = ['#1976d2', '#9c27b0', '#ff9800', '#4caf50', '#e91e63', '#00838f', '#5d4037'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function TransactionsTable({ data, loading }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const rows = data?.data ?? [];
  const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            {data?.tableTitle ?? 'Recent Transactions'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latest {rows.length} orders
          </Typography>
        </Box>

        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>
        ) : (
          <>
            <TableContainer>
              <Table size="small" sx={{ '& td, & th': { borderColor: 'divider' } }}>
                <TableHead>
                  <TableRow>
                    {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Date'].map((h, idx) => (
                      <TableCell
                        key={h}
                        align={idx === 2 ? 'right' : idx === 4 ? 'center' : 'left'}
                        sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((row) => (
                    <TableRow key={row.orderId} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {row.orderId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: avatarColor(row.customer) }}>
                            {initials(row.customer)}
                          </Avatar>
                          <Stack sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {row.customer}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatINR(row.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.paymentMethod}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(row.date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
              sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1 }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
