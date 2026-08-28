import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Products from './pages/Products';
import Banners from './pages/Banners';
import Projects from './pages/Projects';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="banners" element={<Banners />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="products" element={<Products />} />
            <Route path="projects" element={<Projects />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
