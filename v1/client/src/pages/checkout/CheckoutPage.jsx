import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createOrder } from '../../api/orderService';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, loadCart, subtotal } = useCart();
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await createOrder({ shippingAddress, paymentMethod: 'Fake Card' });
      await loadCart();
      navigate('/orders');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to place order');
    }
  };

  return (
    <main className="page-shell utility-page">
      <div className="section-heading">
        <span className="section-kicker">Fake checkout</span>
        <h1>Place order</h1>
      </div>
      <div className="cart-layout">
        <form className="panel-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          {Object.entries(shippingAddress).map(([key, value]) => (
            <label key={key}>
              {key.replace(/([A-Z])/g, ' $1')}
              <input
                onChange={(event) =>
                  setShippingAddress({
                    ...shippingAddress,
                    [key]: event.target.value,
                  })
                }
                required
                type={key === 'email' ? 'email' : 'text'}
                value={value}
              />
            </label>
          ))}
          <button
            className="primary-button wide-button"
            disabled={cart.items.length === 0}
            type="submit"
          >
            Place fake order
          </button>
        </form>
        <aside className="summary-card">
          <h2>Summary</h2>
          <div>
            <span>Items</span>
            <strong>{cart.items.length}</strong>
          </div>
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
