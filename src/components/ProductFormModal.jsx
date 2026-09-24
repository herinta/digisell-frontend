import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Image, Link, Tag, DollarSign, Layers, Package, FileText } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Template Notion',
  'iOS Shortcut',
  'Source Code',
  'E-Book & Kursus',
  'Preset & Desain',
  'Spreadsheet Otomatis',
  'Lainnya'
];

export default function ProductFormModal({ isOpen, onClose, onSaveSuccess, productToEdit }) {
  if (!isOpen) return null;

  const isEdit = Boolean(productToEdit && productToEdit.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Template Notion');
  const [badge, setBadge] = useState('');
  const [stock, setStock] = useState('10');
  const [unlimitedStock, setUnlimitedStock] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price != null ? String(productToEdit.price) : '');
      setOriginalPrice(productToEdit.originalPrice != null ? String(productToEdit.originalPrice) : '');
      setCategory(productToEdit.category || 'Template Notion');
      setBadge(productToEdit.badge || '');
      setStock(productToEdit.stock != null ? String(productToEdit.stock) : '10');
      setUnlimitedStock(Boolean(productToEdit.unlimitedStock));
      setImageUrl(productToEdit.imageUrl || '');
      setFileUrl(productToEdit.fileUrl || '');
    } else {
      // Defaults for new product
      setTitle('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setCategory('Template Notion');
      setBadge('Rilisan Baru 🔥');
      setStock('10');
      setUnlimitedStock(false);
      setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      setFileUrl('');
    }
    setErrorMsg('');
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price || !imageUrl.trim() || !fileUrl.trim()) {
      setErrorMsg('Harap lengkapi semua field wajib bertanda bintang (*).');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 1000) {
      setErrorMsg('Harga minimal adalah Rp 1.000');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('seller_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category,
      badge: badge.trim() || null,
      stock: unlimitedStock ? 0 : parseInt(stock, 10) || 0,
      unlimitedStock,
      imageUrl: imageUrl.trim(),
      fileUrl: fileUrl.trim()
    };

    try {
      const url = isEdit
        ? `http://localhost:8080/api/seller/products/${productToEdit.id}`
        : 'http://localhost:8080/api/seller/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Gagal menyimpan produk.');
      }

      const saved = await res.json();
      onSaveSuccess(saved);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {isEdit ? 'Edit Detail Produk Digital' : 'Tambah Produk Digital Baru'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              {isEdit ? 'Perbarui informasi etalase, harga, dan file akses produk ini.' : 'Produk akan langsung muncul di etalase link-in-bio tokomu.'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-title">
                Judul Produk <span style={{ color: '#ff3b81' }}>*</span>
              </label>
              <input
                id="prod-title"
                type="text"
                required
                placeholder="Contoh: Notion Freelance Workspace 2026"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category & Badge */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">Kategori Produk</label>
                <select
                  id="prod-category"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ background: '#0e1422' }}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-badge">Badge Promo (Opsional)</label>
                <input
                  id="prod-badge"
                  type="text"
                  placeholder="Contoh: Best Seller 🔥, Diskon 50%"
                  className="form-input"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>
            </div>

            {/* Prices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-price">
                  Harga Jual (Rp) <span style={{ color: '#ff3b81' }}>*</span>
                </label>
                <input
                  id="prod-price"
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  placeholder="50000"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-orig-price">
                  Harga Asli Coret (Rp) (Opsional)
                </label>
                <input
                  id="prod-orig-price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="100000"
                  className="form-input"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Stock & Unlimited */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-stock">Kuota Lisensi / Stok</label>
                <input
                  id="prod-stock"
                  type="number"
                  min="0"
                  disabled={unlimitedStock}
                  placeholder="10"
                  className="form-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div style={{ paddingTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#f1f5f9', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={unlimitedStock}
                    onChange={(e) => setUnlimitedStock(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#ff3b81' }}
                  />
                  <span>Stok Tanpa Batas (Unlimited)</span>
                </label>
              </div>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-image">
                URL Gambar Cover <span style={{ color: '#ff3b81' }}>*</span>
              </label>
              <input
                id="prod-image"
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                className="form-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Gunakan tautan gambar langsung (Unsplash, CDN, imgur, dll.)
              </span>
            </div>

            {/* Digital File URL / Master Link */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-file">
                URL File / Master Akses Digital <span style={{ color: '#ff3b81' }}>*</span>
              </label>
              <input
                id="prod-file"
                type="text"
                required
                placeholder="https://drive.google.com/drive/folders/... atau link Notion duplicate"
                className="form-input"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
              <span style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '4px', display: 'block' }}>
                🔒 <strong>Aman:</strong> Tautan ini dilindungi Spring Security dan hanya diberikan ke pembeli setelah pembayaran berhasil dikonfirmasi.
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-desc">
                Deskripsi Lengkap Produk <span style={{ color: '#ff3b81' }}>*</span>
              </label>
              <textarea
                id="prod-desc"
                required
                rows={4}
                placeholder="Jelaskan fitur, manfaat, dan cara pemakaian produk digital ini..."
                className="form-input"
                style={{ resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-back-clean"
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-submit-pay"
                style={{ flex: 2 }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isEdit ? 'Simpan Perubahan' : 'Buat & Terbitkan Produk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
