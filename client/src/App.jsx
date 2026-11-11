import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditor from './pages/AdminEditor';
import CategoryManagePage from './pages/CategoryManagePage';
import './styles/ZohoTheme.css';
import './index.css';

function AppLayout() {
  const location = useLocation();

  // Scroll to top on route navigation
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogListingPage />} />
          <Route path="/category/:slug" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/editor" element={<AdminEditor />} />
          <Route path="/admin/editor/:id" element={<AdminEditor />} />
          <Route path="/admin/categories" element={<CategoryManagePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
