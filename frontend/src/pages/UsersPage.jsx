import { useEffect, useState } from 'react';
import api from '../api/client';

const initialUser = {
  name: '',
  email: '',
  password: '',
  role: 'viewer',
  status: 'active'
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialUser);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
      setMessage('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/users', form);
      setForm(initialUser);
      setMessage('User created successfully.');
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter ? user.role === roleFilter : true;
    const q = search.trim().toLowerCase();
    const matchSearch = q
      ? user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
      : true;

    return matchRole && matchSearch;
  });

  return (
    <section>
      <h2>User Management</h2>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}

      <form className="card form-grid" onSubmit={createUser}>
        <h3>Create User</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
        >
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn" type="submit">
          Create User
        </button>
      </form>

      <div className="card">
        <div className="row between">
          <h3>Users</h3>
          <span className="badge">Total: {filteredUsers.length}</span>
        </div>
        <div className="filter-row">
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-pill ${user.status}`}>{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
};

export default UsersPage;
