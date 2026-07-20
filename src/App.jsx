import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

import Search from './components/Search/Search';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Topnav from './components/Topnav/Topnav';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Blogs from './pages/Blogs/Blogs';
import SingleBlog from './pages/Blogs/SingleBlog';
import Store from './pages/Store/Store';
import Single from './pages/Single/Single';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Orders from './pages/Orders/Orders';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

import LoginForm from './pages/Auth/LoginForm';
import RegisterForm from './pages/Auth/RegisterForm';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminBlogs from './pages/Admin/AdminBlogs';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';
import { ToastProvider } from './lib/ToastContext';

function RequireAdmin({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

const Layout = () => (
  <>
    <Topnav />
    <Search />
    <Outlet />
    <Footer />
    <button className="btn-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <FaArrowUp />
    </button>
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Store /> },
      { path: '/shop/:id', element: <Single /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/blogs/:id', element: <SingleBlog /> },
      { path: '/about-us', element: <About /> },
      { path: '/contact-us', element: <Contact /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/orders', element: <Orders /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '/login', element: <LoginForm /> },
  { path: '/get-started', element: <RegisterForm /> },
  {
    path: '/admin',
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'blogs', element: <AdminBlogs /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {loading && <Loader />}
          {!loading && <RouterProvider router={router} />}
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
