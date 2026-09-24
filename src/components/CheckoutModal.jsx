import React, { useState } from 'react';
import { X, Lock, CreditCard, Sparkles, Loader2, Check } from 'lucide-react';

export default function CheckoutModal({ product, onClose, onPaymentSuccess }) {
  if (!product) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'HEMAT10' || code === 'DISKON10') {
      setAppliedPromo({ code, discountPercent: 10 });
    } else {
      setPromoError('Kode promo tidak valid. Coba: HEMAT10');
      setAppliedPromo(null);
    }
  };

  const subtotal = product.price;
  const discountAmount = appliedPromo ? Math.round(subtotal * (appliedPromo.discountPercent / 100)) : 0;
  const total = subtotal - discountAmount;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!email || !whatsapp) {
      setErrorMsg('Alamat Email dan WhatsApp wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name || 'Pembeli',
          customerEmail: email,
          customerPhone: whatsapp,
          promoCode: appliedPromo ? appliedPromo.code : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Gagal membuat pesanan. Pastikan backend aktif.');
      }

      const orderData = await response.json();
      setCreatedOrder(orderData);

      // Otomatisasi pembayaran: langsung anggap lunas (PAID) secara otomatis
      // Tidak perlu klik tombol simulasi apapun atau repot di Midtrans sandbox
      const simRes = await fetch(`http://localhost:8080/api/orders/${orderData.orderId}/simulate-pay`, {
        method: 'POST',
      });
      const simData = await simRes.json();

      onPaymentSuccess({
        orderId: simData.orderId,
        productTitle: product.title,
        downloadUrl: simData.downloadUrl,
        downloadToken: simData.downloadToken,
        downloadExpiry: simData.downloadExpiry,
        customerEmail: email,
        customerPhone: whatsapp,
        amount: total,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header (Screenshot 1: Checkout & Subtitle) */}
        <div className="modal-header" style={{ paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              Checkout
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              Fill in your details to complete the purchase.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ paddingTop: '16px' }}>
          {/* Product Preview Card (Screenshot 1 style) */}
          <div className="checkout-product-preview">
            <img src={product.imageUrl} alt={product.title} className="preview-thumb" />
            <div className="preview-details">
              <h4 className="preview-title">{product.title}</h4>
              <p className="preview-desc">{product.description}</p>
            </div>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: '10px', padding: '12px', color: '#fecdd3', fontSize: '0.85rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="chk-name">Name</label>
                <input
                  id="chk-name"
                  type="text"
                  placeholder="Full Name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="chk-email">Email <span style={{ color: '#ff3b81' }}>*</span></label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  placeholder="me@mail.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* WhatsApp */}
              <div className="form-group">
                <label className="form-label" htmlFor="chk-whatsapp">WhatsApp <span style={{ color: '#ff3b81' }}>*</span></label>
                <input
                  id="chk-whatsapp"
                  type="tel"
                  required
                  placeholder="62 812 3456 7890"
                  className="form-input"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              {/* Promo Code */}
              <div className="form-group">
                <label className="form-label" htmlFor="chk-promo">Promo Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="chk-promo"
                    type="text"
                    placeholder="ENTER PROMO CODE (Coba: HEMAT10)"
                    className="form-input"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '0 16px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <span style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> Promo {appliedPromo.code} berhasil dipasang (Diskon 10%)
                  </span>
                )}
                {promoError && (
                  <span style={{ fontSize: '0.78rem', color: '#f43f5e', marginTop: '6px', display: 'block' }}>
                    {promoError}
                  </span>
                )}
              </div>

              {/* Subtotal & Total breakdown (Screenshot 1 style) */}
              <div className="checkout-summary-clean">
                <div className="summary-clean-row">
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="summary-clean-row" style={{ color: '#10b981' }}>
                    <span>Diskon Promo (10%)</span>
                    <span>-{formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="summary-clean-row total-row">
                  <span>Total</span>
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>{formatIDR(total)}</span>
                </div>
              </div>

              {/* Prominent Pink Pay Button (Screenshot 1 style) */}
              <button
                type="submit"
                disabled={loading}
                className="btn-pay-pink"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Bayar Sekarang ({formatIDR(total)})
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.78rem', marginTop: '14px' }}>
                <Lock size={13} />
                <span>Enkripsi 256-Bit SSL • Akses Instan Tanpa Perlu Akun</span>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
