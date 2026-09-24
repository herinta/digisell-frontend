import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, Loader2, Check } from 'lucide-react';

export default function SellerAuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', prefilledUsername = '' }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [username, setUsername] = useState(prefilledUsername);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = mode === 'register'
      ? { username, fullName, email, password }
      : { identifier: email || username, password };

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memproses autentikasi.');
      }

      localStorage.setItem('seller_token', data.token);
      localStorage.setItem('seller_profile', JSON.stringify(data));
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('herindev');
    setPassword('password123');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {mode === 'register' ? 'Daftar Akun Seller' : 'Masuk ke Dashboard Seller'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              {mode === 'register' ? 'Mulai buat etalase link-in-bio pribadimu' : 'Kelola produk, stok, dan pencairan saldo'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '8px',
                background: mode === 'login' ? '#ff3b81' : 'transparent',
                color: mode === 'login' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onClick={() => { setMode('login'); setErrorMsg(''); }}
            >
              Masuk
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '8px',
                background: mode === 'register' ? '#ff3b81' : 'transparent',
                color: mode === 'register' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              onClick={() => { setMode('register'); setErrorMsg(''); }}
            >
              Daftar Akun
            </button>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: '10px', padding: '12px', color: '#fecdd3', fontSize: '0.85rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-username">Custom Username (Link Toko)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="auth-username"
                      type="text"
                      required
                      placeholder="namakamu"
                      className="form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', display: 'block' }}>
                    Link tokomu akan menjadi: <strong>digisell.id/{username || 'namakamu'}</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-fullname">Nama Lengkap</label>
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    placeholder="Contoh: Herin Pratama"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                {mode === 'register' ? 'Alamat Email' : 'Email atau Username'}
              </label>
              <input
                id="auth-email"
                type={mode === 'register' ? 'email' : 'text'}
                required
                placeholder={mode === 'register' ? 'nama@gmail.com' : 'herindev atau email'}
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                placeholder="Minimal 6 karakter"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pay-pink"
              style={{ marginTop: '10px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  {mode === 'register' ? 'Buat Toko Sekarang' : 'Masuk ke Dashboard'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login button */}
          {mode === 'login' && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                className="preset-btn"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
                onClick={handleDemoLogin}
              >
                Gunakan Akun Demo Default (user: herindev / pass: password123)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
