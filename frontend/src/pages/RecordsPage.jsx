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

  const loadRecords = async () => {
    try {
      const { data } = await api.get('/records?limit=20');
      setRecords(data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load records');
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

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
      await loadRecords();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create record');
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      await api.delete(`/records/${id}`);
      await loadRecords();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete record');
    }
  };

  return (
    <section>
      <h1>Financial Records</h1>
      {error ? <p className="error">{error}</p> : null}

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
    </section>
  );
};

export default RecordsPage;
