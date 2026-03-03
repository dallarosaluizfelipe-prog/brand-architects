import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

const ADMIN_SESSION_KEY = 'dalla_admin_pin';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const Admin: React.FC = () => {
  const [pin, setPin] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      try {
        const { pin: storedPin, expires } = JSON.parse(stored);
        if (Date.now() < expires) {
          setPin(storedPin);
        } else {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  }, []);

  const handleLogin = (validPin: string) => {
    setPin(validPin);
    sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ pin: validPin, expires: Date.now() + SESSION_DURATION })
    );
  };

  const handleLogout = () => {
    setPin(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  if (!pin) {
    return <AdminLogin onSuccess={handleLogin} />;
  }

  return <AdminPanel pin={pin} onLogout={handleLogout} />;
};

export default Admin;
