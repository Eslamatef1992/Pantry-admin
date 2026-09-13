import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Banners from './pages/Banners';
import BannerForm from './pages/BannerForm';
import Brands from './pages/Brands';
import BrandForm from './pages/BrandForm';
import StaticPages from './pages/StaticPages';
import StaticPageForm from './pages/StaticPageForm';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Admins from './pages/Admins';
import AdminForm from './pages/AdminForm';
import Rules from './pages/Rules';
import ContactMessages from './pages/ContactMessages';
import Reports from './pages/Reports';
import ProductStock from './pages/ProductStock';
import Seo from './pages/Seo';
import SeoPixelForm from './pages/SeoPixelForm';
import SuperAdminRoute from './components/SuperAdminRoute';

function Shell({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

function App() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Shell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductForm />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/new" element={<CategoryForm />} />
                <Route path="/categories/:id" element={<CategoryForm />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/banners/new" element={<BannerForm />} />
                <Route path="/banners/:id" element={<BannerForm />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/new" element={<BrandForm />} />
                <Route path="/brands/:id" element={<BrandForm />} />
                <Route path="/pages" element={<StaticPages />} />
                <Route path="/pages/new" element={<StaticPageForm />} />
                <Route path="/pages/:id" element={<StaticPageForm />} />
                <Route path="/orders" element={<Orders />} />
                <Route
                  path="/orders/new"
                  element={
                    <SuperAdminRoute>
                      <NewOrder />
                    </SuperAdminRoute>
                  }
                />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users" element={<Users />} />
                <Route
                  path="/admins"
                  element={
                    <SuperAdminRoute>
                      <Admins />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admins/new"
                  element={
                    <SuperAdminRoute>
                      <AdminForm />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/admins/:id"
                  element={
                    <SuperAdminRoute>
                      <AdminForm />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/rules"
                  element={
                    <SuperAdminRoute>
                      <Rules />
                    </SuperAdminRoute>
                  }
                />
                <Route path="/contact-messages" element={<ContactMessages />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/product-stock" element={<ProductStock />} />
                <Route
                  path="/seo"
                  element={
                    <SuperAdminRoute>
                      <Seo />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/seo/pixels/new"
                  element={
                    <SuperAdminRoute>
                      <SeoPixelForm />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/seo/pixels/:id"
                  element={
                    <SuperAdminRoute>
                      <SeoPixelForm />
                    </SuperAdminRoute>
                  }
                />
              </Routes>
            </Shell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
