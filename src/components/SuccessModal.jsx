import React from 'react';
import { CheckCircle2, Download, ExternalLink, X } from 'lucide-react';

export default function SuccessModal({ orderData, onClose }) {
  if (!orderData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Transaksi Berhasil</span>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body success-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            Terima Kasih Atas Pembelianmu!
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Akses produk digital kamu telah diaktifkan dan tanda terima telah dikirimkan ke <strong>{orderData.customerEmail}</strong>.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
              <span>ID Transaksi:</span>
              <span style={{ color: '#fff', fontFamily: 'monospace' }}>{orderData.orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              <span>Produk:</span>
              <span style={{ color: '#6366f1' }}>{orderData.productTitle}</span>
            </div>
          </div>

          <a
            href={orderData.downloadUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="btn-download"
          >
            <Download size={20} />
            Unduh File Digital Sekarang
            <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={onClose}
            style={{ marginTop: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Kembali ke Toko
          </button>
        </div>
      </div>
    </div>
  );
}
