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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminFoodsPage from "./pages/admin/AdminFoodsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/foods" element={<FoodsPage />} />

        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]} />}>
          <Route path="/payments" element={<PaymentHistoryPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/foods" element={<AdminFoodsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
