import { useMemo, useState } from 'react';
import {
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
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import StatusChip from './StatusChip';
import { formatINR, formatNumber } from '../utils/format';

const columns = [
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'unitsSold', label: 'Units Sold', sortable: true, align: 'right' },
  { key: 'revenue', label: 'Revenue', sortable: true, align: 'right' },
  { key: 'stockStatus', label: 'Stock', sortable: true, align: 'center' },
];

export default function ProductsTable({ data, loading }) {
  const [orderBy, setOrderBy] = useState('revenue');
  const [order, setOrder] = useState('desc');

  const rows = useMemo(() => {
    const items = [...(data?.data ?? [])];
    items.sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av;
      }
      return order === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return items;
  }, [data, order, orderBy]);

  const handleSort = (key) => {
    if (orderBy === key) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(key);
      setOrder('desc');
    }
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            {data?.tableTitle ?? 'Top Performing Products'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click a column to sort
          </Typography>
        </Box>

        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ '& td, & th': { borderColor: 'divider' } }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? 'left'}
                      sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}
                    >
                      {col.sortable ? (
                        <TableSortLabel
                          active={orderBy === col.key}
                          direction={orderBy === col.key ? order : 'asc'}
                          onClick={() => handleSort(col.key)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 }, transition: 'background 120ms ease' }}
                  >
                    <TableCell>
                      <Stack>
                        <Typography variant="body2" fontWeight={600}>
                          {row.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.id} · ★ {row.rating}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.category}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatNumber(row.unitsSold)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatINR(row.revenue)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <StatusChip status={row.stockStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
