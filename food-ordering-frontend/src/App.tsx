import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicRoute from "./components/layout/PublicRoute";
import HomePage from "./pages/HomePage/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import FoodsPage from "./pages/FoodsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        <Route path="/foods" element={<FoodsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payments" element={<PaymentHistoryPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
