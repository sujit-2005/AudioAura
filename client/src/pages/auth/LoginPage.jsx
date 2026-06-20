import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const from = location.state?.from || '/products';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in');
    }
  };

  return (
    <main className="auth-page page-shell">
      <form className="panel-form" onSubmit={handleSubmit}>
        <span className="section-kicker">Welcome back</span>
        <h1>Log in to AudioAura</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            type="email"
            value={form.email}
          />
        </label>
        <label>
          Password
          <input
            minLength="8"
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
            type="password"
            value={form.password}
          />
        </label>
        <button className="primary-button wide-button" type="submit">
          Log in
        </button>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
