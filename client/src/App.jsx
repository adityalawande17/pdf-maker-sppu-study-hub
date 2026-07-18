import { useState } from 'react';
import Login from './components/Login';
import Editor from './components/Editor';
import { getToken, clearToken } from './api';
import './App.css';

function App() {
  const [token, setTokenState] = useState(() => getToken());

  function handleAuthError() {
    clearToken();
    setTokenState(null);
  }

  if (!token) {
    return <Login onLoggedIn={setTokenState} />;
  }

  return <Editor token={token} onAuthError={handleAuthError} />;
}

export default App;
