import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  ReceiptText,
  ShoppingCart,
  Soup,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import CartModal from "../cart/CartModal";
import CartBadge from "../cart/CartBadge";

function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { cartCount, refreshCartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.userId && !isAdmin) {
      refreshCartCount(user.userId);
    }
  }, [isAuthenticated, user?.userId, isAdmin, refreshCartCount]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition text-sm font-medium ${
      isActive ? "text-orange-600" : "text-slate-200 hover:text-orange-600"
    }`;

  const mobileLinkClass =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-orange-50";

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setCartModalOpen(false);
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <nav className="mx-auto flex items-center justify-between md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-700 text-white shadow-md shadow-orange-200">
            <UtensilsCrossed size={22} />
          </div>

          <div>
            <h1 className="font-black tracking-tight !text-slate-400">
              FoodieHub
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/foods" className={navClass}>
            Foods
          </NavLink>

          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/cart" className={navClass}>
                Cart
              </NavLink>

              <NavLink to="/orders" className={navClass}>
                Orders
              </NavLink>

              <NavLink to="/payments" className={navClass}>
                Payments
              </NavLink>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <NavLink to="/admin" className={navClass}>
                Admin
              </NavLink>

              <NavLink to="/payments" className={navClass}>
                Payments
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {!isAdmin && user?.userId && (
                <button
                  type="button"
                  onClick={() => setCartModalOpen(true)}
                  className="relative flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-orange-50"
                >
                  <ShoppingCart size={25} />
                  <CartBadge count={cartCount} />
                </button>
              )}

              <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2">
                <User size={16} className="text-orange-600" />

                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name}
                  </p>

                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    {user?.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className={`text-sm font-semibold transition ${
                  location.pathname === "/signin"
                    ? "border-b-2 border-orange-600 pb-1 text-orange-600"
                    : "text-slate-200 hover:text-orange-600"
                }`}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  location.pathname === "/signup"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-300"
                    : "bg-orange-700 text-white shadow-md shadow-orange-200 hover:bg-orange-800"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          className="rounded-xl p-2 hover:bg-orange-50 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X className="text-slate-700" />
          ) : (
            <Menu className="text-slate-700" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" className={mobileLinkClass} onClick={closeMobileMenu}>
              <LayoutDashboard size={18} />
              Home
            </Link>

            <Link
              to="/foods"
              className={mobileLinkClass}
              onClick={closeMobileMenu}
            >
              <Soup size={18} />
              Foods
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/cart"
                  className={mobileLinkClass}
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart size={18} />
                  Cart
                </Link>

                <Link
                  to="/orders"
                  className={mobileLinkClass}
                  onClick={closeMobileMenu}
                >
                  <ReceiptText size={18} />
                  Orders
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={mobileLinkClass}
                onClick={closeMobileMenu}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/payments"
                className={mobileLinkClass}
                onClick={closeMobileMenu}
              >
                <ReceiptText size={18} />
                Payments
              </Link>
            )}

            <div className="mt-3 border-t border-orange-100 pt-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/signin"
                    onClick={closeMobileMenu}
                    className={`rounded-xl py-3 text-center text-sm font-semibold transition ${
                      location.pathname === "/signin"
                        ? "border border-orange-600 bg-orange-100 text-orange-600"
                        : "border border-orange-200 text-slate-700"
                    }`}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className={`rounded-xl py-3 text-center text-sm font-semibold transition ${
                      location.pathname === "/signup"
                        ? "bg-orange-700 text-white shadow-md shadow-orange-300"
                        : "bg-orange-600 text-white"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Cart Modal */}
      {user?.userId && !isAdmin && (
        <CartModal
          isOpen={cartModalOpen}
          onClose={() => setCartModalOpen(false)}
          userId={user.userId}
          onCartUpdate={() => refreshCartCount(user.userId)}
        />
      )}
    </header>
  );
}

export default Navbar;