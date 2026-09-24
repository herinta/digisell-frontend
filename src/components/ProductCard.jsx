import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle, PackageX } from 'lucide-react';

export default function ProductCard({ product, onViewDetail, onBuyClick }) {
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
    <div className={`product-card glass-panel ${isOutOfStock ? 'card-disabled' : ''}`} onClick={() => onViewDetail(product)}>
      <div className="product-thumb-wrapper">
        <img src={product.imageUrl} alt={product.title} className="product-thumb" loading="lazy" />
        
        {/* Category & Badge */}
        <div className="product-card-badges">
          <span className="badge-category">{product.category || 'Digital Good'}</span>
          {product.badge && (
            <span className="badge-highlight">
              {product.badge}
            </span>
          )}
        </div>

        {/* Stock Status Pill Overlay */}
        <div className="stock-pill-overlay">
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
          ) : (
            <span className="stock-pill unlimited">
              Akses Unlimited
            </span>
          )}
        </div>
      </div>

      <div className="product-info">
        {/* Pricing Row with Strikethrough Discount (Lifelist style) */}
        <div className="price-tag-row">
          <span className="price-badge-pink">{formatIDR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="price-strikethrough">{formatIDR(product.originalPrice)}</span>
          )}
        </div>

        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-bottom-row">
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {product.soldCount ? `${product.soldCount}+ Terjual` : 'Baru Rilis'}
          </span>

          <button
            type="button"
            disabled={isOutOfStock}
            className={`btn-buy ${isOutOfStock ? 'btn-disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onBuyClick(product);
            }}
          >
            {isOutOfStock ? (
              'Habis Terjual'
            ) : (
              <>
                Beli Langsung
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
