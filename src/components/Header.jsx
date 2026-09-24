import React from 'react';
import { Check, Download, Zap, ShoppingBag, Globe } from 'lucide-react';

export default function Header({ sellerProfile, totalProducts = 4 }) {
  const name = sellerProfile?.fullName || 'Herin Dev';
  const handle = sellerProfile?.username || 'herindev';
  const bio = sellerProfile?.bio || 'Creator & digital seller. Menyediakan template Notion, otomasi spreadsheet, dan source code siap pakai langsung dikirim otomatis setelah bayar.';
  const avatar = sellerProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  return (
    <header className="profile-header">
      <div className="avatar-wrapper">
        <img
          src={avatar}
          alt={name}
          className="avatar-img"
        />
        <div className="verified-badge" title="Verified Creator">
          <Check size={14} strokeWidth={3} />
        </div>
      </div>

      <h1 className="profile-name">
        {name}
        <span className="profile-handle">@{handle}</span>
      </h1>

      <p className="profile-bio">
        {bio}
      </p>

      {/* Social Proof Stats: Total Sales & Total Products */}
      <div className="stats-row">
        <div className="stat-item">
          <ShoppingBag size={14} color="#ff3b81" />
          <span><strong>1.450+</strong> Produk Terjual</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Download size={14} color="#6366f1" />
          <span><strong>{totalProducts}</strong> Produk Digital</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Zap size={14} color="#10b981" />
          <span style={{ color: '#10b981', fontWeight: 600 }}>Instant Delivery</span>
        </div>
      </div>

      <div className="social-links">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="https://x.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter / X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a href="https://portfolio.com" target="_blank" rel="noreferrer" className="social-btn" title="Website / Portofolio">
          <Globe size={18} />
        </a>
      </div>
    </header>
  );
}
