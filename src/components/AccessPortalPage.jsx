import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Download,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function AccessPortalPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [accessData, setAccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!orderId || !token) {
      setErrorMsg('Tautan akses tidak lengkap atau tidak valid.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/orders/access?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setAccessData(data);
        if (!data.valid) {
          setErrorMsg(data.message || 'Tautan akses tidak valid.');
        }
      })
      .catch((err) => {
        setErrorMsg('Gagal memverifikasi token akses.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId, token]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="access-page-container">
        <div className="access-card glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="pulse-dot" style={{ width: '16px', height: '16px', margin: '0 auto 16px auto' }} />
          <h3 style={{ color: '#fff' }}>Memverifikasi Tautan Unduhan Anda...</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !accessData?.valid) {
    return (
      <div className="access-page-container">
        <div className="access-card glass-panel" style={{ textAlign: 'center', padding: '50px 24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
            Tautan Akses Tidak Valid atau Kadaluarsa
          </h2>
          <p style={{ color: '#fecdd3', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            {errorMsg || 'Tautan ini telah melewati batas waktu 24 jam demi keamanan file digital.'}
          </p>
          <button
            type="button"
            className="btn-pay-pink"
            style={{ maxWidth: '240px', margin: '0 auto' }}
            onClick={() => navigate('/herindev')}
          >
            <ArrowLeft size={16} />
            Kembali ke Toko
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="access-page-container">
      <div className="access-card glass-panel">
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="success-icon-wrap" style={{ margin: '0 auto 16px auto' }}>
            <CheckCircle2 size={40} />
          </div>
          <div className="instant-access-badge" style={{ marginBottom: '12px' }}>
            <Clock size={14} />
            <span>Tautan Akses Aman Aktif (Batas 24 Jam)</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Akses File Digital Anda
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Terima kasih! Pesanan Anda telah terverifikasi dan siap diakses.
          </p>
        </div>

        {/* Product Details Box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Nomor Order:</span>
            <span style={{ color: '#6366f1', fontFamily: 'monospace', fontWeight: 700 }}>{accessData.orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
            <span style={{ color: '#94a3b8' }}>Produk:</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{accessData.productTitle}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Total Pembayaran:</span>
            <span style={{ color: '#10b981', fontWeight: 800 }}>{formatIDR(accessData.amount)} (LUNAS)</span>
          </div>
        </div>

        {/* Big Action Button */}
        <a
          href={accessData.downloadUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="btn-pay-pink"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontSize: '1.05rem', marginBottom: '16px' }}
        >
          <Download size={20} />
          Buka / Unduh File Digital Sekarang
          <ExternalLink size={16} />
        </a>

        {/* Instructions */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>
            💡 Petunjuk Penggunaan:
          </strong>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0 }}>
            <li>Jika produk adalah <strong>Template Notion</strong>: Klik tombol di atas, lalu pilih opsi <strong>"Duplicate"</strong> di pojok kanan atas workspace Notion Anda.</li>
            <li>Jika produk adalah <strong>Google Drive / ZIP</strong>: Pilih opsi <strong>"Download"</strong> atau "Make a copy" ke Google Drive Anda.</li>
            <li>Salinan tautan ini juga telah otomatis dikirimkan ke email: <strong>{accessData.customerEmail}</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
