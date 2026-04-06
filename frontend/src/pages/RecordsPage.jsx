import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
};

const RecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: ''
  });

  const loadRecords = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        limit: '20',
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.category ? { category: filters.category } : {})
      }).toString();

      const { data } = await api.get(`/records?${query}`);
      setRecords(data.data);
      setMessage('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [filters.type, filters.category]);

  const createRecord = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/records', {
        ...form,
        amount: Number(form.amount),
        date: new Date(form.date).toISOString()
      });
      setForm(initialForm);
      setMessage('Record created successfully.');
      await loadRecords();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create record');
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      await api.delete(`/records/${id}`);
      setMessage('Record deleted successfully.');
      await loadRecords();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete record');
    }
  };

  return (
    <section>
      <div className="row between">
        <h2>Financial Records</h2>
        <button className="btn secondary" type="button" onClick={loadRecords}>
          Refresh
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}

      <div className="card filter-row">
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        />
        <button
          className="btn light"
          type="button"
          onClick={() => setFilters({ type: '', category: '' })}
        >
          Clear Filters
        </button>
      </div>

      {user?.role === 'admin' ? (
        <form className="card form-grid" onSubmit={createRecord}>
          <h3>Create Record</h3>
          <input
            placeholder="Amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
          <button className="btn" type="submit">
            Add Record
          </button>
        </form>
      ) : null}

      <div className="card">
        <h3>Latest Records</h3>
        {loading ? <p className="muted">Loading records...</p> : null}
        {!loading && !records.length ? <p className="muted">No records found for selected filters.</p> : null}
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Created By</th>
              {user?.role === 'admin' ? <th>Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.type}</td>
                <td>{record.category}</td>
                <td>${record.amount.toFixed(2)}</td>
                <td>{record.createdBy?.name || 'N/A'}</td>
                {user?.role === 'admin' ? (
                  <td>
                    <button className="btn danger" type="button" onClick={() => deleteRecord(record._id)}>
                      Delete
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
};

export default RecordsPage;
