import barData from '../data/bar.json';
import pieData from '../data/pie.json';
import productsData from '../data/products.json';
import transactionsData from '../data/transactions.json';

const simulate = (payload, { delay = 450, failRate = 0 } = {}) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Network error — please try again.'));
        return;
      }
      resolve(JSON.parse(JSON.stringify(payload)));
    }, delay);
  });

export const fetchMonthlyRevenue = () => simulate(barData);
export const fetchCategoryRevenue = () => simulate(pieData);
export const fetchTopProducts = () => simulate(productsData, { delay: 550 });
export const fetchRecentTransactions = () => simulate(transactionsData, { delay: 650 });
