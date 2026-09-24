import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerAuthModal from './SellerAuthModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Lock,
  Layers,
  ShoppingBag,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('seller_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'access' || (params.get('orderId') && params.get('token'))) {
      navigate(`/access?${params.toString()}`);
    }
  }, [navigate]);

  const handleClaim = (e) => {
    e.preventDefault();
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (data) => {
    setCurrentUser(data);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_profile');
    setCurrentUser(null);
  };

  return (
    <div className="landing-wrapper">
      {/* Navbar */}
      <nav className="landing-nav glass-panel">
        <div className="landing-brand">
          <div className="brand-dot" />
          <span className="brand-text">DigiSell</span>
        </div>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="btn-nav-outline"
            onClick={() => navigate('/herindev')}
          >
            Lihat Toko Demo
            <ExternalLink size={14} />
          </button>

          {currentUser ? (
            <>
              <button
                type="button"
                className="btn-nav-primary"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard (@{currentUser.username})
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="btn-nav-outline"
                style={{ color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)' }}
                onClick={handleLogout}
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-nav-outline"
                onClick={handleOpenLogin}
              >
                Masuk Seller
              </button>
              <button
                type="button"
                className="btn-nav-primary"
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
              >
                Mulai Jualan
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-pill">
          <Sparkles size={14} color="#ff3b81" />
          <span>Platform Link-in-Bio Khusus Produk Digital</span>
        </div>

        <h1 className="hero-title">
          Jual Produk Digitalmu Lewat Satu Tautan di Bio.
        </h1>

        <p className="hero-subtitle">
          Bukan marketplace ramai. Ini etalase eksklusif khusus produk kamu sendiri—template Notion, spreadsheet otomatis, source code, dan preset desain—langsung terima pembayaran QRIS otomatis.
        </p>

        {/* Claim Handle Bar */}
        <form className="claim-box glass-panel" onSubmit={handleClaim}>
          <div className="claim-prefix">digisell.id/</div>
          <input
            type="text"
            className="claim-input"
            placeholder="namakamu"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
          />
          <button type="submit" className="btn-claim">
            Klaim Link Saya
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="hero-demo-callout">
          <span>Ingin melihat toko yang sudah aktif?</span>
          <button
            type="button"
            className="demo-link-btn"
            onClick={() => navigate('/herindev')}
          >
            Buka Toko @herindev <ExternalLink size={12} />
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="landing-features">
        <div className="feature-grid">
          <div className="landing-feature-card glass-panel">
            <div className="feature-icon" style={{ background: 'rgba(255, 59, 129, 0.15)', color: '#ff3b81' }}>
              <Zap size={22} />
            </div>
            <h3>Frictionless Checkout</h3>
            <p>
              Pembeli tidak perlu registrasi atau login akun yang bikin malas. Cukup masukkan email dan WhatsApp, bayar via QRIS, dan akses file langsung terbuka.
            </p>
          </div>

          <div className="landing-feature-card glass-panel">
            <div className="feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <ShieldCheck size={22} />
            </div>
            <h3>Anti Race-Condition Stock</h3>
            <p>
              Punya kuota lisensi terbatas? Database diamankan dengan sistem <em>Pessimistic Locking</em> sehingga tidak akan pernah terjadi pembelian melebihi kuota.
            </p>
          </div>

          <div className="landing-feature-card glass-panel">
            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={22} />
            </div>
            <h3>Dompet Seller & Tarik Saldo</h3>
            <p>
              Hasil penjualan tercatat real-time di dashboard. Kamu bisa menarik uang penjualan langsung ke rekening BCA, Mandiri, BRI, BNI, atau GoPay.
            </p>
          </div>

          <div className="landing-feature-card glass-panel">
            <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Lock size={22} />
            </div>
            <h3>Expiring Download Link</h3>
            <p>
              Tautan download terlindungi dengan token yang otomatis kadaluarsa dalam 24 jam untuk mencegah file digitalmu dibagikan secara ilegal.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="landing-cta glass-panel">
        <h2>Siap Menghasilkan Cuan dari Karya Digitalmu?</h2>
        <p>Bergabunglah dengan ratusan kreator independen yang menjual produk digital secara profesional.</p>
        <button
          type="button"
          className="btn-pay-pink"
          style={{ maxWidth: '280px', margin: '0 auto', fontSize: '1rem' }}
          onClick={() => {
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
        >
          Buat Toko Sekarang
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 DigiSell. Platform Link-in-Bio Store untuk Kreator Digital.</p>
      </footer>

      {/* Seller Auth Modal */}
      <SellerAuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        prefilledUsername={handle}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
