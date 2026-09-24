import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  PackageCheck,
  AlertTriangle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowLeft,
  Save,
  Check,
  LogOut,
  User,
  Lock,
  ExternalLink,
  Copy,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import SellerAuthModal from './SellerAuthModal';
import ProductFormModal from './ProductFormModal';

export default function SellerDashboard({ onBackToStore }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'withdraw'
  const [dashboardData, setDashboardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication states
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('seller_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Product CRUD states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Withdrawal form states
  const [wdAmount, setWdAmount] = useState('');
  const [wdBank, setWdBank] = useState('BCA');
  const [wdAccountNum, setWdAccountNum] = useState('');
  const [wdAccountHolder, setWdAccountHolder] = useState('');
  const [wdLoading, setWdLoading] = useState(false);
  const [wdSuccessMsg, setWdSuccessMsg] = useState('');
  const [wdErrorMsg, setWdErrorMsg] = useState('');

  // Stock edit states
  const [stockUpdates, setStockUpdates] = useState({});
  const [stockSavedId, setStockSavedId] = useState(null);

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${title}" secara permanen dari katalog tokomu?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('seller_token');
      const res = await fetch(`http://localhost:8080/api/seller/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.message || 'Gagal menghapus produk.');
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('seller_token');
    if (!token) {
      setIsAuthChecking(false);
      return;
    }

    fetch('http://localhost:8080/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Token expired');
        return res.json();
      })
      .then(seller => {
        setCurrentUser(seller);
        localStorage.setItem('seller_profile', JSON.stringify(seller));
      })
      .catch(() => {
        // Fallback to local profile if available, or reset
        const local = localStorage.getItem('seller_profile');
        if (local) {
          try { setCurrentUser(JSON.parse(local)); } catch {}
        }
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, []);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val || 0);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('seller_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, wdRes] = await Promise.all([
        fetch('http://localhost:8080/api/seller/dashboard', { headers: getAuthHeaders() }),
        fetch('http://localhost:8080/api/seller/products', { headers: getAuthHeaders() }),
        fetch('http://localhost:8080/api/seller/withdrawals', { headers: getAuthHeaders() }),
      ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
        // Initialize stock edits
        const initStock = {};
        prodData.forEach((p) => {
          initStock[p.id] = { stock: p.stock, unlimitedStock: p.unlimitedStock };
        });
        setStockUpdates(initStock);
      }
      if (wdRes.ok) setWithdrawals(await wdRes.json());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockSave = async (productId) => {
    const edit = stockUpdates[productId];
    if (!edit) return;

    try {
      const res = await fetch(`http://localhost:8080/api/seller/products/${productId}/stock`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          stock: parseInt(edit.stock, 10),
          unlimitedStock: edit.unlimitedStock,
        }),
      });

      if (res.ok) {
        setStockSavedId(productId);
        setTimeout(() => setStockSavedId(null), 2500);
        loadData();
      }
    } catch (err) {
      alert('Gagal update stok: ' + err.message);
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setWdErrorMsg('');
    setWdSuccessMsg('');

    const amountNum = parseFloat(wdAmount);
    const available = dashboardData?.wallet?.availableBalance || 0;

    if (isNaN(amountNum) || amountNum < 50000) {
      setWdErrorMsg('Minimal penarikan adalah Rp 50.000');
      return;
    }

    if (amountNum > available) {
      setWdErrorMsg('Saldo aktif tidak mencukupi untuk penarikan ini.');
      return;
    }

    if (!wdAccountNum || !wdAccountHolder) {
      setWdErrorMsg('Lengkapi nomor rekening dan nama pemilik rekening.');
      return;
    }

    setWdLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/seller/withdrawals', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount: wdAmount,
          bankName: wdBank,
          accountNumber: wdAccountNum,
          accountHolder: wdAccountHolder,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal mengajukan penarikan');
      }

      setWdSuccessMsg(`Penarikan ${formatIDR(amountNum)} ke ${wdBank} (${wdAccountNum}) berhasil diajukan dan diproses!`);
      setWdAmount('');
      loadData();
    } catch (err) {
      setWdErrorMsg(err.message);
    } finally {
      setWdLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_profile');
    setCurrentUser(null);
    window.location.href = '/';
  };

  const sellerUsername = currentUser?.username || dashboardData?.sellerUsername || 'herindev';
  const storeUrl = `${window.location.origin}/${sellerUsername}`;

  // If not logged in and checking finished, show Auth Guard
  if (!isAuthChecking && !currentUser) {
    return (
      <div className="dashboard-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(255, 59, 129, 0.12)', border: '1px solid rgba(255, 59, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#ff3b81' }}>
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Area Khusus Seller</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Halaman ini khusus untuk pemilik toko mengelola produk, stok, dan pencairan saldo. Silakan masuk terlebih dahulu.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-submit-pay"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
            >
              Masuk ke Akun Seller
            </button>
            <button
              type="button"
              className="btn-back-clean"
              style={{ justifyContent: 'center', width: '100%', padding: '12px' }}
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
            >
              Daftar Jadi Seller Baru
            </button>
            <button
              type="button"
              className="preset-btn"
              style={{ marginTop: '12px' }}
              onClick={() => window.location.href = '/'}
            >
              Kembali ke Beranda DigiSell
            </button>
          </div>
        </div>

        <SellerAuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(seller) => {
            setCurrentUser(seller);
            setAuthModalOpen(false);
            loadData();
          }}
        />
      </div>
    );
  }

  const wallet = dashboardData?.wallet || { availableBalance: 0, totalRevenue: 0, totalWithdrawn: 0 };

  return (
    <div className="dashboard-container">
      {/* Top Bar Navigation */}
      <div className="dashboard-top-nav">
        <button
          type="button"
          className="btn-back-store"
          onClick={() => {
            window.location.href = `/${sellerUsername}`;
          }}
        >
          <ArrowLeft size={16} />
          Lihat Toko Publik (@{sellerUsername})
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.fullName}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>{currentUser.fullName}</span>
            </div>
          )}

          <button
            type="button"
            className="preset-btn"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleLogout}
            title="Keluar dari akun seller"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Title & Custom Link Box */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Panel Kontrol Penjualan</h2>
          <p className="dashboard-subtitle">Kelola stok digital, pantau transaksi masuk, dan tarik uang hasil penjualan.</p>
        </div>

        <button type="button" className="btn-refresh" onClick={loadData} title="Refresh Data">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Custom Store Link Bar */}
      <div className="store-link-bar glass-panel">
        <div className="store-link-info">
          <span className="store-link-label">Tautan Publik Toko Anda:</span>
          <code className="store-link-url">{storeUrl}</code>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="preset-btn"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => {
              navigator.clipboard.writeText(storeUrl);
              alert('Tautan toko berhasil disalin ke clipboard!');
            }}
          >
            Salin Tautan
          </button>
          <a
            href={`/${sellerUsername}`}
            target="_blank"
            rel="noreferrer"
            className="preset-btn"
            style={{ padding: '6px 14px', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Kunjungi Toko
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          type="button"
          className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} />
          Ringkasan Bisnis
        </button>
        <button
          type="button"
          className={`dash-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <PackageCheck size={16} />
          Kelola Produk & Stok
        </button>
        <button
          type="button"
          className={`dash-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          <ArrowDownToLine size={16} />
          Dompet & Tarik Dana
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="stat-card-label">Total Omset Kotor</span>
                <h3 className="stat-card-val">{formatIDR(wallet.totalRevenue)}</h3>
              </div>
            </div>

            <div className="stat-card glass-panel highlight-border">
              <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <span className="stat-card-label">Saldo Siap Ditarik</span>
                <h3 className="stat-card-val" style={{ color: '#10b981' }}>{formatIDR(wallet.availableBalance)}</h3>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap" style={{ background: 'rgba(217, 70, 239, 0.15)', color: '#d946ef' }}>
                <PackageCheck size={20} />
              </div>
              <div>
                <span className="stat-card-label">Total Pesanan Selesai</span>
                <h3 className="stat-card-val">{dashboardData?.totalOrders || 0} Trx</h3>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="stat-card-label">Stok Kritis (≤ 3)</span>
                <h3 className="stat-card-val" style={{ color: '#f59e0b' }}>{dashboardData?.lowStockCount || 0} Produk</h3>
              </div>
            </div>
          </div>

          {/* Quick Payout Callout */}
          <div className="payout-banner glass-panel">
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '4px' }}>
                Siap mencairkan uang hasil penjualanmu?
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Saldo aktif sebesar <strong>{formatIDR(wallet.availableBalance)}</strong> dapat langsung ditarik ke rekening bank lokal Anda.
              </p>
            </div>
            <button
              type="button"
              className="btn-buy"
              onClick={() => setActiveTab('withdraw')}
            >
              <ArrowDownToLine size={16} />
              Tarik Saldo Sekarang
            </button>
          </div>

          {/* Recent Orders Table */}
          <div className="table-card glass-panel">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
              Pesanan Terakhir
            </h4>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Email Pembeli</th>
                    <th>Produk Digital</th>
                    <th>Nominal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentOrders?.length > 0 ? (
                    dashboardData.recentOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td style={{ fontFamily: 'monospace', color: '#6366f1' }}>{ord.orderId}</td>
                        <td>{ord.customerEmail}</td>
                        <td style={{ color: '#fff' }}>{ord.productTitle}</td>
                        <td style={{ fontWeight: 700 }}>{formatIDR(ord.amount)}</td>
                        <td>
                          <span className={`status-chip ${ord.status.toLowerCase()}`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
                        Belum ada riwayat pesanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & STOCK (FULL CRUD) */}
      {activeTab === 'products' && (
        <div className="tab-content">
          <div className="table-card glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  Katalog Produk Digital & Stok Lisensi
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Tambah produk baru, perbarui informasi & file akses, atau sesuaikan kuota stok.
                </p>
              </div>

              <button
                type="button"
                className="btn-pay-pink"
                style={{ width: 'auto', padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={handleOpenAddProduct}
              >
                <Plus size={18} />
                Tambah Produk Digital
              </button>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Terjual</th>
                    <th>Sisa Kuota Stok</th>
                    <th style={{ textAlign: 'center' }}>Kelola & Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => {
                      const edit = stockUpdates[p.id] || { stock: p.stock, unlimitedStock: p.unlimitedStock };
                      const isSaved = stockSavedId === p.id;

                      return (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#fff' }}>{p.title}</div>
                                {p.badge && (
                                  <span style={{ fontSize: '0.72rem', color: '#ff3b81', background: 'rgba(255, 59, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: '6px' }}>
                              {p.category || 'Digital'}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{formatIDR(p.price)}</div>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#ef4444' }}>
                                {formatIDR(p.originalPrice)}
                              </div>
                            )}
                          </td>
                          <td>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>{p.soldCount || 0} unit</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="number"
                                min="0"
                                disabled={edit.unlimitedStock}
                                value={edit.stock}
                                onChange={(e) => {
                                  setStockUpdates({
                                    ...stockUpdates,
                                    [p.id]: { ...edit, stock: e.target.value },
                                  });
                                }}
                                className="stock-input"
                              />
                              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={edit.unlimitedStock || false}
                                  onChange={(e) => {
                                    setStockUpdates({
                                      ...stockUpdates,
                                      [p.id]: { ...edit, unlimitedStock: e.target.checked },
                                    });
                                  }}
                                />
                                Unlimited
                              </label>
                              <button
                                type="button"
                                className={`btn-save-stock ${isSaved ? 'saved' : ''}`}
                                onClick={() => handleStockSave(p.id)}
                                title="Simpan perubahan kuota stok"
                              >
                                {isSaved ? <Check size={13} /> : <Save size={13} />}
                                {isSaved ? 'OK' : 'Simpan'}
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                className="preset-btn"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit seluruh detail produk"
                              >
                                <Edit3 size={13} color="#6366f1" />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="preset-btn"
                                style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                title="Hapus produk ini"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '36px' }}>
                        Belum ada produk digital. Klik tombol di atas untuk menambah produk pertamamu!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOMPET & PENARIKAN DANA */}
      {activeTab === 'withdraw' && (
        <div className="tab-content">
          <div className="withdraw-layout">
            {/* Form Penarikan */}
            <div className="table-card glass-panel">
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Tarik Saldo ke Rekening Bank
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                Dana yang masuk dari Payment Gateway (Midtrans) akan dicairkan langsung ke rekening terdaftar.
              </p>

              {wdSuccessMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {wdSuccessMsg}
                </div>
              )}

              {wdErrorMsg && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#fecdd3', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {wdErrorMsg}
                </div>
              )}

              <form onSubmit={handleWithdrawalSubmit}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" htmlFor="wd-amount">Nominal Penarikan</label>
                    <span style={{ fontSize: '0.78rem', color: '#10b981' }}>
                      Maksimal: {formatIDR(wallet.availableBalance)}
                    </span>
                  </div>
                  <input
                    id="wd-amount"
                    type="number"
                    step="1000"
                    placeholder="Contoh: 250000"
                    className="form-input"
                    value={wdAmount}
                    onChange={(e) => setWdAmount(e.target.value)}
                    required
                  />
                  {/* Quick Preset Buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {[100000, 500000, 1000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="preset-btn"
                        onClick={() => setWdAmount(String(amt))}
                      >
                        {formatIDR(amt)}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="preset-btn"
                      onClick={() => setWdAmount(String(wallet.availableBalance))}
                    >
                      Tarik Semua
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wd-bank">Bank / E-Wallet Tujuan</label>
                  <select
                    id="wd-bank"
                    className="form-input"
                    value={wdBank}
                    onChange={(e) => setWdBank(e.target.value)}
                  >
                    <option value="BCA">BCA (Bank Central Asia)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BRI">Bank BRI</option>
                    <option value="BNI">Bank BNI</option>
                    <option value="Bank Jago">Bank Jago</option>
                    <option value="Seabank">SeaBank</option>
                    <option value="GoPay">GoPay (E-Wallet)</option>
                    <option value="OVO">OVO (E-Wallet)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wd-acc-num">Nomor Rekening / Akun</label>
                  <input
                    id="wd-acc-num"
                    type="text"
                    placeholder="Contoh: 8271928371"
                    className="form-input"
                    value={wdAccountNum}
                    onChange={(e) => setWdAccountNum(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wd-acc-holder">Nama Pemilik Rekening</label>
                  <input
                    id="wd-acc-holder"
                    type="text"
                    placeholder="Sesuai buku tabungan / e-wallet"
                    className="form-input"
                    value={wdAccountHolder}
                    onChange={(e) => setWdAccountHolder(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={wdLoading || wallet.availableBalance < 50000}
                  className="btn-buy"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
                >
                  <ArrowDownToLine size={18} />
                  {wdLoading ? 'Mengajukan Pencairan...' : 'Ajukan Penarikan Dana'}
                </button>
              </form>
            </div>

            {/* Riwayat Penarikan */}
            <div className="table-card glass-panel">
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                Riwayat Penarikan Dana
              </h4>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Bank & Rekening</th>
                      <th>Nominal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length > 0 ? (
                      withdrawals.map((w) => (
                        <tr key={w.id}>
                          <td style={{ fontFamily: 'monospace', color: '#6366f1' }}>{w.withdrawalCode}</td>
                          <td>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{w.bankName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{w.accountNumber} ({w.accountHolder})</div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>{formatIDR(w.amount)}</td>
                          <td>
                            <span className="status-chip processed">
                              <CheckCircle2 size={12} />
                              PROCESSED
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>
                          Belum ada riwayat penarikan dana.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Create & Edit Modal */}
      <ProductFormModal
        isOpen={productModalOpen}
        productToEdit={productToEdit}
        onClose={() => setProductModalOpen(false)}
        onSaveSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
