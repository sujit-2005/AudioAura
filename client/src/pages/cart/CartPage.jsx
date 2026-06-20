import { Link } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const CartPage = () => {
  const { cart, cartLoading, removeItem, subtotal, updateItem } = useCart();

  return (
    <main className="page-shell utility-page">
      <div className="section-heading">
        <span className="section-kicker">Your bag</span>
        <h1>Cart</h1>
      </div>

      {cartLoading && <p>Loading cart…</p>}
      {!cartLoading && cart.items.length === 0 && (
        <div className="catalog-state">
          <h2>Your cart is empty</h2>
          <p>Start with the collection and add products you love.</p>
          <Link className="primary-button" to="/products">
            Shop products
          </Link>
        </div>
      )}

      {cart.items.length > 0 && (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => {
              const product = item.product;
              const price = product.discountPrice ?? product.price;

              return (
                <article className="cart-item" key={product._id}>
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.images?.[0]?.altText || product.name}
                  />
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.brand}</p>
                    <strong>{formatCurrency(price)}</strong>
                  </div>
                  <input
                    min="1"
                    onChange={(event) =>
                      updateItem(product._id, Number(event.target.value))
                    }
                    type="number"
                    value={item.quantity}
                  />
                  <button onClick={() => removeItem(product._id)} type="button">
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
          <aside className="summary-card">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <p>Shipping and tax are calculated during fake checkout.</p>
            <Link className="primary-button wide-button" to="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CartPage;
