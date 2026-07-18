import { useRef, useState } from 'react';
import { login, setToken } from '../api';
import Spinner from './Spinner';

const SLOW_HINT_DELAY = 4000;

export default function Login({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const slowTimer = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSlow(false);
    slowTimer.current = setTimeout(() => setSlow(true), SLOW_HINT_DELAY);

    try {
      const token = await login(password);
      setToken(token);
      onLoggedIn(token);
    } catch (err) {
      setError(err.message);
    } finally {
      clearTimeout(slowTimer.current);
      setLoading(false);
      setSlow(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>PDF Maker</h1>
        <p className="login-subtitle">Enter the shared password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        {error && <div className="error-message">{error}</div>}
        {loading && slow && (
          <div className="slow-hint">
            Waking up the server — this can take up to a minute on the first request.
          </div>
        )}
        <button type="submit" disabled={loading || !password}>
          {loading && <Spinner />}
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
