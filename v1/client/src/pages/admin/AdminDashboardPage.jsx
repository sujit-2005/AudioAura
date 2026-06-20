import { useEffect, useMemo, useState } from 'react';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../../api/productService';
import { getAllOrders } from '../../api/orderService';
import { CATEGORIES } from '../../utils/catalogOptions';
import formatCurrency from '../../utils/formatCurrency';

const emptyProduct = {
  name: '',
  slug: '',
  brand: '',
  category: 'Headphones',
  shortDescription: '',
  fullDescription: '',
  price: '',
  discountPrice: '',
  stock: '',
  rating: '0',
  imageUrl: '',
  imageAltText: '',
  featured: false,
  bestSeller: false,
};

const toProductPayload = (form) => ({
  name: form.name,
  slug: form.slug,
  brand: form.brand,
  category: form.category,
  shortDescription: form.shortDescription,
  fullDescription: form.fullDescription,
  price: Number(form.price),
  discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
  stock: Number(form.stock),
  rating: Number(form.rating),
  images: [{ url: form.imageUrl, altText: form.imageAltText || form.name }],
  specifications: [],
  featured: form.featured,
  bestSeller: form.bestSeller,
});

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    const [productsResponse, ordersResponse] = await Promise.all([
      getProducts({ limit: 100 }),
      getAllOrders(),
    ]);

    setProducts(productsResponse.data);
    setOrders(ordersResponse.data);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const stats = useMemo(
    () => ({
      inventory: products.reduce((total, product) => total + product.stock, 0),
      products: products.length,
      orders: orders.length,
    }),
    [orders, products],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const payload = toProductPayload(form);

      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated');
      } else {
        await createProduct(payload);
        setMessage('Product created');
      }

      setForm(emptyProduct);
      setEditingId('');
      await loadAdminData();
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Unable to save product');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...emptyProduct,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stock: String(product.stock),
      rating: String(product.rating),
      imageUrl: product.images?.[0]?.url || '',
      imageAltText: product.images?.[0]?.altText || '',
      featured: product.featured,
      bestSeller: product.bestSeller,
    });
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    await loadAdminData();
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="page-shell utility-page">
      <div className="section-heading">
        <span className="section-kicker">Admin</span>
        <h1>AudioAura dashboard</h1>
      </div>

      <section className="admin-stats">
        <article>
          <span>Products</span>
          <strong>{stats.products}</strong>
        </article>
        <article>
          <span>Inventory units</span>
          <strong>{stats.inventory}</strong>
        </article>
        <article>
          <span>Orders</span>
          <strong>{stats.orders}</strong>
        </article>
      </section>

      <section className="admin-layout">
        <form className="panel-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
          {message && <p className="form-message">{message}</p>}
          {[
            ['name', 'Name'],
            ['slug', 'Slug'],
            ['brand', 'Brand'],
            ['shortDescription', 'Short description'],
            ['fullDescription', 'Full description'],
            ['price', 'Price'],
            ['discountPrice', 'Discount price'],
            ['stock', 'Stock'],
            ['rating', 'Rating'],
            ['imageUrl', 'Image URL'],
            ['imageAltText', 'Image alt text'],
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                onChange={(event) => updateField(name, event.target.value)}
                required={!['discountPrice', 'imageAltText'].includes(name)}
                type={['price', 'discountPrice', 'stock', 'rating'].includes(name) ? 'number' : 'text'}
                value={form[name]}
              />
            </label>
          ))}
          <label>
            Category
            <select
              onChange={(event) => updateField('category', event.target.value)}
              value={form.category}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-label">
            <input
              checked={form.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
              type="checkbox"
            />
            Featured
          </label>
          <label className="checkbox-label">
            <input
              checked={form.bestSeller}
              onChange={(event) => updateField('bestSeller', event.target.checked)}
              type="checkbox"
            />
            Best seller
          </label>
          <button className="primary-button wide-button" type="submit">
            {editingId ? 'Save changes' : 'Create product'}
          </button>
        </form>

        <div className="admin-table-wrap">
          <h2>Products</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{formatCurrency(product.discountPrice ?? product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => startEdit(product)} type="button">
                      Edit
                    </button>
                    <button onClick={() => removeProduct(product._id)} type="button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Orders</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.user?.email || order.shippingAddress.email}</td>
                  <td>{order.status}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
