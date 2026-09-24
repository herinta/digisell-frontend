import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Zap,
  PackageX,
  AlertTriangle,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';

export default function ProductDetailPage({ product, onBack, onBuyNow }) {
  if (!product) return null;

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val || 0);
  };

  const isOutOfStock = !product.unlimitedStock && product.stock <= 0;
  const isLowStock = !product.unlimitedStock && product.stock > 0 && product.stock <= 3;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan produk berhasil disalin!');
    }
  };

  return (
    <div className="product-detail-page">
      {/* Top Navigation */}
      <div className="detail-top-nav">
        <button type="button" className="btn-back-clean" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali ke Semua Produk</span>
        </button>

        <button type="button" className="btn-icon-clean" onClick={handleShare} title="Bagikan Produk">
          <Share2 size={18} />
        </button>
      </div>

      {/* Main Product Container */}
      <div className="product-detail-layout">
        {/* Product Hero Image */}
        <div className="product-hero-wrapper">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-hero-img"
          />

          {/* Stock Tag on Image */}
          <div className="detail-image-badges">
            <span className="badge-category">{product.category || 'Digital Asset'}</span>
            {isOutOfStock ? (
              <span className="stock-pill out-of-stock">
                <PackageX size={12} />
                Stok Habis
              </span>
            ) : isLowStock ? (
              <span className="stock-pill low-stock">
                <AlertTriangle size={12} />
                Sisa {product.stock} Lisensi!
              </span>
            ) : !product.unlimitedStock ? (
              <span className="stock-pill in-stock">
                <CheckCircle size={12} />
                Sisa {product.stock} Slot
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Information Card (Lifelist Screenshot 2 Style) */}
        <div className="product-main-card glass-panel">
          <div className="instant-access-badge" style={{ marginBottom: '12px' }}>
            <span className="pulse-dot" />
            <span>Instant Download via Web & Email</span>
          </div>

          <h1 className="product-detail-title">{product.title}</h1>

          {/* Product Meta Row: Sold Count, Category, Seller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', margin: '10px 0 16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              <Sparkles size={13} />
              {product.soldCount ? `${product.soldCount}+ Terjual` : 'Baru Rilis'}
            </span>

            {product.sellerUsername && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.82rem',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                Oleh <strong style={{ color: '#fff' }}>@{product.sellerUsername}</strong>
              </span>
            )}

            {product.badge && (
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                {product.badge}
              </span>
            )}
          </div>

          <p className="product-detail-desc" style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1' }}>
            {product.description}
          </p>

          <div className="detail-divider" />

          {/* Pricing & CTA Section */}
          <div className="detail-price-section">
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="detail-original-price">
                <span>{formatIDR(product.originalPrice)}</span>
                {discountPercent && (
                  <span className="discount-tag">Hemat {discountPercent}%</span>
                )}
              </div>
            )}

            <div className="detail-current-price">
              {formatIDR(product.price)}
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              className={`btn-pay-pink ${isOutOfStock ? 'btn-disabled' : ''}`}
              style={{ padding: '16px', fontSize: '1.05rem', marginTop: '16px' }}
              onClick={() => {
                if (!isOutOfStock) onBuyNow(product);
              }}
            >
              {isOutOfStock ? 'Stok Habis Terjual' : 'Buy Now'}
              {!isOutOfStock && <ArrowRight size={18} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', marginTop: '12px' }}>
              <Zap size={14} color="#10b981" />
              <span>Akses langsung terbuka otomatis setelah bayar (Tanpa Login)</span>
            </div>
          </div>
        </div>

        {/* Detailed Description Card */}
        <div className="product-section-card glass-panel">
          <h3 className="section-card-title">
            <Sparkles size={18} color="#6366f1" />
            Deskripsi & Detail Produk
          </h3>
          <div style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {product.description}
          </div>
        </div>

        {/* Detailed Features Breakdown (Lifelist Screenshot 2: "Fitur yang ada di dalamnya") */}
        <div className="product-section-card glass-panel">
          <h3 className="section-card-title">
            <Sparkles size={18} color="#ff3b81" />
            Fitur yang ada di dalamnya
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '16px' }}>
            Setiap pembelian produk digital ini mencakup paket aset lengkap yang siap pakai dan mudah diduplikasi:
          </p>

          <div className="features-checklist">
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <CheckCircle size={16} color="#10b981" />
              </div>
              <div>
                <strong>Akses Master File Asli:</strong>
                <p>Link duplicate Notion workspace / Google Drive folder resmi dengan izin akses penuh.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrap">
                <Clock size={16} color="#6366f1" />
              </div>
              <div>
                <strong>Akses Seumur Hidup (Lifetime):</strong>
                <p>Cukup bayar sekali dan nikmati pembaruan fitur atau perbaikan template secara gratis selamanya.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrap">
                <ShieldCheck size={16} color="#10b981" />
              </div>
              <div>
                <strong>Panduan Step-by-Step & Support:</strong>
                <p>Disertai dokumentasi video/teks panduan cara duplicate dan penyesuaian template untuk pemula.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Guidance */}
        <div className="product-section-card glass-panel">
          <h3 className="section-card-title">Cara Mendapatkan File Setelah Pembelian</h3>
          <div className="steps-flow">
            <div className="step-box">
              <span className="step-num">1</span>
              <div>
                <strong>Klik "Buy Now"</strong>
                <p>Masukkan Email dan WhatsApp aktif Anda (tanpa perlu mendaftar akun).</p>
              </div>
            </div>

            <div className="step-box">
              <span className="step-num">2</span>
              <div>
                <strong>Bayar Instan</strong>
                <p>Selesaikan pembayaran melalui QRIS (GoPay, OVO, Dana, BCA, dll).</p>
              </div>
            </div>

            <div className="step-box">
              <span className="step-num">3</span>
              <div>
                <strong>Langsung Akses File</strong>
                <p>Tombol unduh file langsung aktif di layar dan tautan cadangan dikirim ke email Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Conversion */}
      <div className="mobile-sticky-bottom">
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Harga</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{formatIDR(product.price)}</span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          className={`btn-pay-pink ${isOutOfStock ? 'btn-disabled' : ''}`}
          style={{ width: 'auto', padding: '12px 24px', fontSize: '0.95rem' }}
          onClick={() => {
            if (!isOutOfStock) onBuyNow(product);
          }}
        >
          {isOutOfStock ? 'Habis' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
