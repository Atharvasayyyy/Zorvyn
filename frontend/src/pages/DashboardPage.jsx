import { useEffect, useState } from 'react';
import api from '../api/client';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [range, setRange] = useState('month');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get(`/dashboard/summary?range=${range}`);
        setSummary(data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load summary');
      }
    };

    fetchSummary();
  }, [range]);

  return (
    <section>
      <div className="row between">
        <h1>Dashboard Summary</h1>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="month">Monthly</option>
          <option value="week">Weekly</option>
        </select>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {summary ? (
        <>
          <div className="grid3">
            <article className="card metric">
              <h3>Total Income</h3>
              <p>${summary.totals.income.toFixed(2)}</p>
            </article>
            <article className="card metric">
              <h3>Total Expenses</h3>
              <p>${summary.totals.expense.toFixed(2)}</p>
            </article>
            <article className="card metric">
              <h3>Net Balance</h3>
              <p>${summary.totals.netBalance.toFixed(2)}</p>
            </article>
          </div>

          <div className="grid2">
            <article className="card">
              <h3>Category Totals</h3>
              <ul className="list">
                {summary.categoryTotals.slice(0, 10).map((item, index) => (
                  <li key={`${item.category}-${item.type}-${index}`}>
                    <span>
                      {item.category} ({item.type})
                    </span>
                    <strong>${item.total.toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>Recent Activity</h3>
              <ul className="list">
                {summary.recentActivity.map((item) => (
                  <li key={item._id}>
                    <span>
                      {new Date(item.date).toLocaleDateString()} - {item.category}
                    </span>
                    <strong>
                      {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                    </strong>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </>
      ) : (
        <p>Loading summary...</p>
      )}
    </section>
  );
};

export default DashboardPage;
