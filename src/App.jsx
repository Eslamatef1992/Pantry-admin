import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import Banners from './pages/Banners';
import Brands from './pages/Brands';
import StaticPages from './pages/StaticPages';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Admins from './pages/Admins';
import Rules from './pages/Rules';
import ContactMessages from './pages/ContactMessages';
import Reports from './pages/Reports';
import ProductStock from './pages/ProductStock';
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
                <Route path="/banners" element={<Banners />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/pages" element={<StaticPages />} />
                <Route path="/orders" element={<Orders />} />
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
              </Routes>
            </Shell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
