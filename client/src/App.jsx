import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Series from "./pages/Series";
import Chapter from "./pages/Chapter";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/series/:slug" element={<Series />} />
          <Route path="/chapter/the-gentle-armor" element={<Navigate to="/chapter/the-quiet-beginning" replace />} />
          <Route path="/chapter/:slug" element={<Chapter />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </CartProvider>
  );
}
