import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  ShoppingCart,
  Soup,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
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

  // Load cart count only when user logs in, not on every render
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      refreshCartCount(user.userId);
    }
  }, [isAuthenticated, user?.userId]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition text-sm font-medium ${isActive
      ? "text-orange-600"
      : "text-slate-200 hover:text-orange-600"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <nav className="mx-auto flex items-center justify-between md:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-700 text-white shadow-md shadow-orange-200">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <h1 className="font-black tracking-tight !text-slate-400">
              FoodieHub
            </h1>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/foods" className={navClass}>
            Foods
          </NavLink>

          {isAuthenticated && (
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

          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  setCartModalOpen(true);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 relative transition ${
                  cartModalOpen
                    ? "bg-orange-100"
                    : "hover:bg-orange-50"
                }`}
              >
                <ShoppingCart size={25} />
                <CartBadge count={cartCount} />
              </button>

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
                className={`text-sm font-semibold transition ${location.pathname === "/signin"
                    ? "text-orange-600 border-b-2 border-orange-600 pb-1"
                    : "text-slate-200 hover:text-orange-600"
                  }`}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${location.pathname === "/signup"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-300"
                    : "bg-orange-700 text-white shadow-md shadow-orange-200 hover:bg-orange-700"
                  }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="rounded-xl p-2 hover:bg-orange-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="text-slate-700" />
          ) : (
            <Menu className="text-slate-700" />
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-orange-50"
            >
              <LayoutDashboard size={18} />
              Home
            </Link>

            <Link
              to="/foods"
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-orange-50"
            >
              <Soup size={18} />
              Foods
            </Link>

            {isAuthenticated && (
              <>
              <Link
                  to="/cart"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-orange-50"
                >
                  Cart
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-orange-50"
                >
                  Orders
                </Link>

                <Link
                  to="/payments"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-orange-50"
                >
                  Payments
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-xl px-4 py-3 hover:bg-orange-50"
              >
                Admin Dashboard
              </Link>
            )}

            <div className="mt-3 border-t border-orange-100 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/signin"
                    className={`rounded-xl py-3 text-center text-sm font-semibold transition ${location.pathname === "/signin"
                        ? "bg-orange-100 text-orange-600 border border-orange-600"
                        : "border border-orange-200 text-slate-700"
                      }`}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className={`rounded-xl py-3 text-center text-sm font-semibold transition ${location.pathname === "/signup"
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

      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        userId={user?.userId || ""}
        onCartUpdate={() => refreshCartCount(user?.userId || "")}
      />
    </header>
  );
}

export default Navbar;