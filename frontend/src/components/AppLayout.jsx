import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', roles: ['viewer', 'analyst', 'admin'] },
    { to: '/records', label: 'Records', roles: ['analyst', 'admin'] },
    { to: '/users', label: 'Users', roles: ['admin'] }
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>FinanceOps</h2>
        <p className="small">
          {user?.name} ({user?.role})
        </p>
        <nav>
          {links
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <button className="btn danger" onClick={logout} type="button">
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
