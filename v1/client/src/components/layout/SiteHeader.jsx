import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const HeadphonesIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2v-3Z" />
    <path d="M20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2v-3Z" />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </svg>
);

const SiteHeader = () => {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-mark" to="/" aria-label="AudioAura home">
          <span className="brand-mark__icon">
            <HeadphonesIcon />
          </span>
          <span>AudioAura</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {isAuthenticated ? (
            <button className="nav-button" onClick={logout} type="button">
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>

        <Link className="icon-button" to="/cart" aria-label="Shopping bag">
          <BagIcon />
          <span className="bag-count">{itemCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
