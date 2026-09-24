import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import SellerDashboard from './components/SellerDashboard';
import AccessPortalPage from './components/AccessPortalPage';
import { ShieldCheck, LayoutDashboard, ArrowLeft } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: 'Notion Fat Loss & Workout Tracker',
    description: 'Template adalah all-in-one sistem untuk menjalankan program turun berat badan secara bertahap. Menggabungkan Workout Plan, Intermittent Fasting, dan Meal Plan dalam satu dashboard Notion.',
    price: 43000,
    originalPrice: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    fileUrl: 'https://drive.google.com/drive/folders/sample-notion-fat-loss',
    category: 'Template Notion',
    badge: '🔥 Best Seller',
    stock: 8,
    unlimitedStock: false,
    soldCount: 342,
  },
  {
    id: 2,
    title: 'iPhone Shortcut - One Click Money Tracker',
    description: 'Catat keuangan harian lebih cepat dari iPhone langsung otomatis tersinkronisasi ke database Notion. Pantau pemasukan, pengeluaran, dan saldo akun.',
    price: 198000,
    originalPrice: 218000,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    fileUrl: 'https://drive.google.com/drive/folders/sample-money-tracker',
    category: 'iOS Shortcut',
    badge: '⚡ Populer',
    stock: 12,
    unlimitedStock: false,
    soldCount: 215,
  },
  {
    id: 3,
    title: 'Notion Template Life Planner All-in-One',
    description: 'Rencanakan hari mu, akademik dan raih goal yang ingin kamu capai dengan satu sistem produktivitas rapi & estetik.',
    price: 58000,
    originalPrice: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    fileUrl: 'https://drive.google.com/drive/folders/sample-life-planner',
    category: 'Template Notion',
    badge: 'Diskon 60%',
    stock: 5,
    unlimitedStock: false,
    soldCount: 520,
  },
  {
    id: 4,
    title: 'Fullstack Spring Boot & React Starter Kit',
    description: 'Source code arsitektur micro-SaaS modern siap pakai dengan autentikasi JWT, integrasi Midtrans, Docker Compose, dan Clean Architecture.',
    price: 150000,
    originalPrice: 300000,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    fileUrl: 'https://github.com/sample/starter-kit-repo',
    category: 'Source Code',
    badge: 'Pro Dev',
    stock: 3,
    unlimitedStock: false,
    soldCount: 180,
  },
];

const CATEGORIES = ['Semua', 'Template Notion', 'iOS Shortcut', 'Source Code'];

// Component for Seller's Link-in-Bio Storefront (e.g. /:username)
function SellerStorefront() {
  const { username = 'herindev' } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);

  const fetchProducts = () => {
    const url = username
      ? `http://localhost:8080/api/products?seller=${encodeURIComponent(username)}`
      : 'http://localhost:8080/api/products';

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Backend not ready');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.log('Using default digital products for seller:', username);
        const filtered = FALLBACK_PRODUCTS.filter(p => !p.sellerUsername || p.sellerUsername.toLowerCase() === username.toLowerCase());
        setProducts(filtered.length > 0 ? filtered : FALLBACK_PRODUCTS);
      });
  };

  useEffect(() => {
    fetchProducts();

    // Fetch dynamic seller profile from backend
    fetch(`http://localhost:8080/api/auth/seller/${username}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSellerProfile(data);
      })
      .catch(() => {});
  }, [username]);

  const filteredProducts = activeCategory === 'Semua'
    ? products
    : products.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="app-container">
      {/* Top Bar Switcher (Clean POV Pembeli - Tanpa Tombol Dashboard) */}
      <div className="global-top-bar">
        <button
          type="button"
          className="btn-back-clean"
          style={{ fontSize: '0.82rem' }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={14} />
          <span>Ke Beranda DigiSell</span>
        </button>
      </div>

      {/* Creator Profile Header */}
      <Header sellerProfile={sellerProfile} totalProducts={products.length} />

      {/* Category Pills */}
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Product List Grid */}
      <main className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetail={(p) => {
              navigate(`/${username}/product/${p.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBuyClick={(p) => setCheckoutProduct(p)}
          />
        ))}
      </main>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          onPaymentSuccess={(orderResult) => {
            setCheckoutProduct(null);
            setSuccessOrder(orderResult);
            fetchProducts();
          }}
        />
      )}

      {/* Success Modal */}
      {successOrder && (
        <SuccessModal
          orderData={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}

      {/* Footer */}
      <footer className="store-footer">
        <div className="secure-badge">
          <ShieldCheck size={14} color="#10b981" />
          <span>Didukung oleh Midtrans Sandbox & Spring Boot API (Race-Condition Safe)</span>
        </div>
        <p>© 2026 {username}. Powered by DigiSell Creator Platform.</p>
      </footer>
    </div>
  );
}

// Component for Full Page Product Detail View (e.g. /:username/product/:productId)
function ProductDetailView() {
  const { username = 'herindev', productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  const fetchCurrentProduct = () => {
    fetch(`http://localhost:8080/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => {
        const fallback = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(productId));
        setProduct(fallback || FALLBACK_PRODUCTS[0]);
      });
  };

  useEffect(() => {
    fetchCurrentProduct();
  }, [productId]);

  if (!product) return null;

  return (
    <>
      <ProductDetailPage
        product={product}
        onBack={() => {
          navigate(`/${username}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBuyNow={(prod) => setCheckoutProduct(prod)}
      />

      {/* Checkout Modal triggered from Buy Now */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
          onPaymentSuccess={(orderResult) => {
            setCheckoutProduct(null);
            setSuccessOrder(orderResult);
            fetchCurrentProduct();
          }}
        />
      )}

      {/* Success Modal */}
      {successOrder && (
        <SuccessModal
          orderData={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}
    </>
  );
}

// Main App Router Wrapper
export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Landing Page for DigiSell Platform */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Seller Dashboard */}
        <Route
          path="/dashboard"
          element={
            <SellerDashboard
              onBackToStore={() => {
                window.location.href = '/herindev';
              }}
            />
          }
        />

        {/* 3. Secure Expiring Download Portal */}
        <Route path="/access" element={<AccessPortalPage />} />

        {/* 4. Full Page Product Detail (POV Pembeli) */}
        <Route path="/:username/product/:productId" element={<ProductDetailView />} />

        {/* 5. Custom Link-in-Bio Storefront for Seller (e.g. /herindev) */}
        <Route path="/:username" element={<SellerStorefront />} />
      </Routes>
    </Router>
  );
}
