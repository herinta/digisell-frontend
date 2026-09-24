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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  QrCode,
  Smartphone,
  Share2,
  Check
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Apakah pembeli harus mendaftar akun untuk membeli produk?',
    a: 'Tidak perlu sama sekali! Pembeli cukup memasukkan alamat email dan nomor WhatsApp aktif untuk pengiriman bukti pembelian, membayar melalui QRIS atau e-wallet, dan tautan akses file digital langsung terbuka seketika di layar.'
  },
  {
    q: 'Bagaimana cara saya menerima uang hasil penjualan?',
    a: 'Setiap ada pesanan yang lunas, saldo hasil penjualan langsung tercatat rapi secara real-time di dompet dashboard tokomu. Kamu bebas menarik dana penjualan kapan saja ke rekening bank (BCA, Mandiri, BRI, BNI) maupun e-wallet tanpa biaya tersembunyi.'
  },
  {
    q: 'Metode pembayaran apa saja yang disediakan untuk pembeli?',
    a: 'Pembeli dapat membayar dengan mudah menggunakan QRIS otomatis yang mendukung semua aplikasi e-wallet populer (GoPay, OVO, Dana, ShopeePay) serta seluruh aplikasi Mobile Banking di Indonesia.'
  },
  {
    q: 'Apakah file digital saya aman dari pembajakan?',
    a: 'Ya, sangat aman. Link master file tidak pernah dibagikan secara publik di etalase. Sistem kami melindungi unduhan menggunakan token terenkripsi unik berbatas waktu (24 jam) yang hanya dapat dibuka setelah pembayaran terkonfirmasi lunas.'
  },
  {
    q: 'Produk digital jenis apa saja yang bisa saya jual di DigiSell?',
    a: 'Kamu bisa menjual berbagai produk digital seperti Template Notion, Template Spreadsheet/Excel, Source Code, E-Book PDF, Preset Lightroom/Video, Desain Grafis & UI Kit, Font, dan produk digital berharga lainnya.'
  },
  {
    q: 'Berapa biaya untuk mulai membuka toko di DigiSell?',
    a: 'Pendaftaran akun seller dan pembuatan toko 100% gratis. Kamu langsung mendapatkan link toko pribadi dan dashboard lengkap tanpa biaya langganan bulanan.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'login' | 'register'
  const [openFaq, setOpenFaq] = useState(0);

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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flat-landing-page">
      {/* 1. TOP FLOATING WHITE PILL NAVBAR (Linktree Style) */}
      <header className="flat-nav-wrapper">
        <nav className="flat-pill-nav">
          <div className="flat-brand" onClick={() => navigate('/')}>
            <span className="flat-brand-text">DigiSell</span>
            <span className="flat-brand-star">✳</span>
          </div>

          <div className="flat-nav-center">
            <button
              type="button"
              className="flat-nav-link"
              onClick={() => navigate('/herindev')}
            >
              Lihat Toko Demo (@herindev)
            </button>
            <a href="#fitur" className="flat-nav-link">
              Fitur
            </a>
            <a href="#tanya-jawab" className="flat-nav-link">
              Tanya Jawab
            </a>
          </div>

          <div className="flat-nav-right">
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="flat-btn-black"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard (@{currentUser.username})
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="flat-btn-text"
                  style={{ color: '#e11d48' }}
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="flat-btn-text"
                  onClick={handleOpenLogin}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  className="flat-btn-black"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                >
                  Mulai Jualan Gratis
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION ON RICH FLAT MAROON */}
      <section className="flat-hero-section">
        <div className="flat-container flat-hero-grid">
          {/* Left Column: Headline & Claim Handle Box */}
          <div className="flat-hero-content">
            <div className="flat-pill-badge">
              <span>Platform Link-in-Bio Khusus Produk Digital</span>
            </div>

            <h1 className="flat-hero-title">
              Satu link di bio untuk menjual semua karya digitalmu.
            </h1>

            <p className="flat-hero-subtitle">
              Bukan marketplace yang ramai pesaing. Ini etalase mandiri milikmu sendiri untuk template Notion, spreadsheet, preset, ebook, dan source code—terima pembayaran QRIS otomatis dan file langsung dikirim seketika.
            </p>

            {/* Claim URL Pill Bar (Linktree Style) */}
            <form className="flat-claim-pill" onSubmit={handleClaim}>
              <span className="flat-claim-prefix">digisell.id/</span>
              <input
                type="text"
                className="flat-claim-input"
                placeholder="namakamu"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              />
              <button type="submit" className="flat-btn-claim">
                Klaim Link Saya
              </button>
            </form>

            <div className="flat-hero-demo-row">
              <span>Ingin melihat hasil jadinya?</span>
              <button
                type="button"
                className="flat-demo-link"
                onClick={() => navigate('/herindev')}
              >
                Kunjungi Toko @herindev <ExternalLink size={13} />
              </button>
            </div>
          </div>

          {/* Right Column: Clean Flat Link-in-Bio Device Mockup */}
          <div className="flat-hero-visual">
            <div className="flat-phone-frame">
              {/* Creator Profile In-Phone */}
              <div className="phone-creator-header">
                <div className="phone-avatar-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Herin Dev"
                    className="phone-avatar"
                  />
                  <span className="phone-verified">✓</span>
                </div>
                <h3 className="phone-seller-name">Herin Dev</h3>
                <span className="phone-seller-handle">digisell.id/herindev</span>
                <p className="phone-seller-bio">
                  Creator & software engineer. Template Notion & tools developer siap pakai.
                </p>
              </div>

              {/* Instant QRIS Badge */}
              <div className="phone-instant-pill">
                <span className="pill-dot" />
                <span>Pembayaran QRIS Otomatis & Akses File Instan</span>
              </div>

              {/* Product Cards Stack In-Phone */}
              <div className="phone-products-list">
                <div className="phone-product-card" onClick={() => navigate('/herindev')}>
                  <img
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=150&q=80"
                    alt="Product"
                    className="phone-product-thumb"
                  />
                  <div className="phone-product-info">
                    <span className="phone-product-title">iPhone Shortcut - Money Tracker</span>
                    <span className="phone-product-price">Rp 198.000</span>
                  </div>
                  <span className="phone-btn-arrow">→</span>
                </div>

                <div className="phone-product-card" onClick={() => navigate('/herindev')}>
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80"
                    alt="Product"
                    className="phone-product-thumb"
                  />
                  <div className="phone-product-info">
                    <span className="phone-product-title">Fullstack Spring Boot & React Starter</span>
                    <span className="phone-product-price">Rp 150.000</span>
                  </div>
                  <span className="phone-btn-arrow">→</span>
                </div>

                <div className="phone-product-card" onClick={() => navigate('/herindev')}>
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80"
                    alt="Product"
                    className="phone-product-thumb"
                  />
                  <div className="phone-product-info">
                    <span className="phone-product-title">Notion Fat Loss & Workout Tracker</span>
                    <span className="phone-product-price">Rp 43.000</span>
                  </div>
                  <span className="phone-btn-arrow">→</span>
                </div>
              </div>

              <div className="phone-footer-brand">
                <span>Powered by DigiSell</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: SHARE YOUR LINK ANYWHERE (Screenshot 3 Style) */}
      <section className="flat-share-section">
        <div className="flat-container flat-share-grid">
          <div className="flat-share-text">
            <h2 className="flat-section-heading">
              Sebarkan tokomu ke mana pun audiensmu berada.
            </h2>
            <p className="flat-section-desc">
              Cukup salin tautan unik tokomu dan pasang di bio Instagram, TikTok, Twitter/X, YouTube, maupun broadcast WhatsApp. Pembeli bisa langsung melihat katalog dan bertransaksi tanpa perlu login atau install aplikasi apapun.
            </p>
            <button
              type="button"
              className="flat-btn-cream"
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
            >
              Mulai Jualan Gratis
            </button>
          </div>

          {/* Layered Card Stack (Visual like Screenshot 3) */}
          <div className="flat-cards-stack-container">
            <div className="flat-stack-card card-blue">
              <span className="stack-icon">✦</span>
              <span>Twitter / X Bio</span>
            </div>
            <div className="flat-stack-card card-pink">
              <span className="stack-icon">📷</span>
              <span>Instagram Bio</span>
            </div>
            <div className="flat-stack-card card-dark">
              <span className="stack-icon">🎵</span>
              <span>TikTok Bio</span>
            </div>
            <div className="flat-stack-card card-main">
              <div className="stack-main-inner">
                <div className="stack-seller-avatar">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Seller"
                  />
                </div>
                <div>
                  <span className="stack-tag">Etalase Toko Digital</span>
                  <div className="stack-handle-pill">
                    <span className="stack-star">✳</span>
                    <strong>digisell.id/herindev</strong>
                  </div>
                </div>
              </div>
              <div className="stack-qr-badge">
                <QrCode size={18} />
                <span>Scan QRIS Instan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAT BENTO SHOWCASE (Screenshot 4 Style - No blurred gradients, pure solid cards) */}
      <section id="fitur" className="flat-bento-section">
        <div className="flat-container">
          <div className="flat-bento-header">
            <h2 className="flat-section-heading center">
              Semua yang kamu butuhkan untuk berjualan digital.
            </h2>
            <p className="flat-section-desc center">
              Dibuat sederhana, cepat, dan otomatis agar kamu bisa fokus berkarya.
            </p>
          </div>

          <div className="flat-bento-grid">
            {/* Bento Card 1: Warm Cream Flat Card with High Contrast */}
            <div className="bento-card bento-cream">
              <div className="bento-icon-pill icon-maroon">
                <Zap size={22} />
              </div>
              <h3 className="bento-title text-dark">Checkout Cepat Tanpa Ribet</h3>
              <p className="bento-desc text-dark-muted">
                Pembeli tidak perlu repot daftar akun atau login. Cukup masukkan email dan nomor WhatsApp, bayar via QRIS otomatis, dan file langsung siap diunduh saat itu juga.
              </p>
              <div className="bento-visual-mini">
                <div className="mini-payment-pill">
                  <Check size={14} color="#15803d" />
                  <span>QRIS & E-Wallet Terverifikasi Otomatis</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Deep Solid Maroon Card */}
            <div className="bento-card bento-maroon">
              <div className="bento-icon-pill icon-light">
                <Sparkles size={22} />
              </div>
              <h3 className="bento-title text-white">Kontrol Kuota & Stok Otomatis</h3>
              <p className="bento-desc text-white-muted">
                Punya slot lisensi atau kuota promo terbatas? Sistem otomatis mengunci dan memperbarui stok secara akurat sehingga penjualan tidak akan pernah melebihi kuota.
              </p>
              <div className="bento-visual-mini">
                <div className="mini-stock-pill">
                  <span>Sisa 3 Slot Lisensi • Stok Terjaga</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Deep Plum / Rich Wine Card */}
            <div className="bento-card bento-wine">
              <div className="bento-icon-pill icon-green">
                <DollarSign size={22} />
              </div>
              <h3 className="bento-title text-white">Pencairan Saldo Mudah & Cepat</h3>
              <p className="bento-desc text-white-muted">
                Pemasukan dari setiap penjualan langsung tercatat transparan di dashboard tokomu. Kamu bebas menarik dana penjualan kapan saja ke rekening BCA, Mandiri, BRI, BNI, atau e-wallet.
              </p>
              <div className="bento-visual-mini">
                <div className="mini-wallet-pill">
                  <span>Tarik ke BCA • Tanpa Potongan Tersembunyi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION ON DEEP MAROON (Screenshot 5 Style) */}
      <section id="tanya-jawab" className="flat-faq-section">
        <div className="flat-container flat-faq-container">
          <h2 className="flat-section-heading center">
            Pertanyaan? Kami Jawab.
          </h2>
          <p className="flat-section-desc center" style={{ marginBottom: '40px' }}>
            Segala hal yang sering ditanyakan seputar cara kerja DigiSell untuk kreator dan pembeli.
          </p>

          <div className="flat-accordion-list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`flat-accordion-item ${isOpen ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="flat-accordion-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="flat-accordion-content">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BIG BOTTOM CTA (Screenshot 1 / 3 Inspired) */}
      <section className="flat-cta-section">
        <div className="flat-container">
          <div className="flat-cta-box">
            <h2 className="flat-cta-title">
              Siap menghasilkan dari karya digitalmu?
            </h2>
            <p className="flat-cta-desc">
              Buka tokomu sekarang dalam kurang dari 2 menit. 100% gratis tanpa biaya pendaftaran.
            </p>

            <div className="flat-cta-actions">
              <button
                type="button"
                className="flat-btn-cta-light"
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
              >
                Buat Toko Sekarang
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="flat-btn-cta-outline"
                onClick={() => navigate('/herindev')}
              >
                Lihat Contoh Toko (@herindev)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FLAT FOOTER */}
      <footer className="flat-footer">
        <div className="flat-container flat-footer-inner">
          <div className="footer-left">
            <div className="flat-brand footer-logo">
              <span className="flat-brand-text">DigiSell</span>
              <span className="flat-brand-star">✳</span>
            </div>
            <p className="footer-tagline">
              Platform Link-in-Bio Store untuk Kreator Digital Indonesia.
            </p>
          </div>

          <div className="footer-links">
            <button type="button" onClick={() => navigate('/herindev')}>Toko Demo</button>
            <a href="#fitur">Fitur</a>
            <a href="#tanya-jawab">FAQ</a>
            <button type="button" onClick={handleOpenLogin}>Masuk Seller</button>
          </div>
        </div>
        <div className="footer-copyright">
          © 2026 DigiSell. Hak Cipta Dilindungi.
        </div>
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
