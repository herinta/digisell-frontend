import React from 'react';
import { X, CheckCircle, ShieldCheck, Zap, ArrowRight, AlertTriangle, PackageX } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onBuyClick }) {
  if (!product) return null;

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const isOutOfStock = !product.unlimitedStock && product.stock <= 0;
  const isLowStock = !product.unlimitedStock && product.stock > 0 && product.stock <= 3;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Detail Produk Digital</span>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Product Thumbnail */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '18px', maxHeight: '220px', position: 'relative' }}>
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div className="instant-access-badge">
              <span className="pulse-dot" />
              <span>Instant Download via Web & Email</span>
            </div>

            {isOutOfStock ? (
              <div className="instant-access-badge" style={{ background: 'rgba(244, 63, 94, 0.15)', borderColor: '#f43f5e', color: '#fecdd3' }}>
                <PackageX size={14} />
                <span>Stok Habis Terjual</span>
              </div>
            ) : isLowStock ? (
              <div className="instant-access-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b', color: '#fbbf24' }}>
                <AlertTriangle size={14} />
                <span>Sisa {product.stock} Lisensi Terakhir!</span>
              </div>
            ) : null}
          </div>

          {/* Product Title & Description (Screenshot 2 style) */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px', color: '#f8fafc', lineHeight: 1.3 }}>
            {product.title}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
            {product.description}
          </p>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px', marginBottom: '20px' }}>
            {product.originalPrice && product.originalPrice > product.price && (
              <div style={{ color: '#f43f5e', textDecoration: 'line-through', fontSize: '0.95rem', fontWeight: 600 }}>
                {formatIDR(product.originalPrice)}
              </div>
            )}
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0 16px 0' }}>
              {formatIDR(product.price)}
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              className={`btn-buy ${isOutOfStock ? 'btn-disabled' : ''}`}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', background: '#ff3b81', borderRadius: '12px' }}
              onClick={() => {
                if (!isOutOfStock) {
                  onClose();
                  onBuyClick(product);
                }
              }}
            >
              {isOutOfStock ? 'Habis Terjual' : 'Buy Now'}
              {!isOutOfStock && <ArrowRight size={18} />}
            </button>
          </div>

          {/* Features breakdown (Screenshot 2 style) */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
              Fitur yang ada di dalamnya:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" />
                <span>File template master lengkap & langsung bisa di-duplicate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#6366f1" />
                <span>Dapat diakses selamanya (Lifetime Access) + Free Updates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Panduan penggunaan step-by-step & garansi link unduh aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
