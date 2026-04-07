import React, { useState, useEffect } from 'react';

interface AdminLoginProps {
  onSuccess: (pin: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const verifyPin = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'verify', pin: code }),
        }
      );
      const data = await res.json();
      if (data.valid) {
        onSuccess(code);
      } else {
        setError('PIN incorreto');
        setPin('');
      }
    } catch {
      setError('Erro de conexão');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl tracking-tight mb-2 font-display">Área Admin</h1>
        <p className="text-neutral-400 text-sm font-sans mb-10">Digite o PIN de 4 dígitos</p>

        {/* PIN dots */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length ? 'bg-black scale-110' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-sans mb-4">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map(
            (key) => (
              <button
                key={key}
                disabled={loading || key === ''}
                onClick={() => {
                  if (key === '←') handleDelete();
                  else if (key !== '') handleDigit(key);
                }}
                className={`h-16 rounded-2xl text-xl font-sans font-medium transition-all ${
                  key === ''
                    ? 'invisible'
                    : key === '←'
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                    : 'bg-white border border-neutral-200 hover:bg-neutral-50 active:scale-95 text-black'
                } ${loading ? 'opacity-50' : ''}`}
              >
                {key}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
