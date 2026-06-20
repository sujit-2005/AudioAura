import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getProductBySlug,
  getRelatedProducts,
} from '../../api/productService';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ProductCard from '../../components/product/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const [productResponse, relatedResponse] = await Promise.all([
          getProductBySlug(slug, controller.signal),
          getRelatedProducts(slug, controller.signal),
        ]);

        setProduct(productResponse.data);
        setRelatedProducts(relatedResponse.data);
        setActiveImage(0);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(
            requestError.response?.data?.message || 'Unable to load product',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    try {
      await addItem(product._id, 1);
      setCartMessage('Added to cart');
    } catch (requestError) {
      setCartMessage(
        requestError.response?.data?.message || 'Unable to add item',
      );
    }
  };

  if (loading) {
    return (
      <main className="page-shell detail-page">
        <LoadingState />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-shell detail-page">
        <ErrorState message={error || 'Product not found'} />
      </main>
    );
  }

  const displayPrice = product.discountPrice ?? product.price;
  const currentImage = product.images?.[activeImage] || product.images?.[0];

  return (
    <main className="page-shell detail-page">
      <Link className="text-link" to="/products">
        ← Back to products
      </Link>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img src={currentImage?.url} alt={currentImage?.altText || product.name} />
          </div>
          <div className="product-gallery__thumbs">
            {product.images.map((image, index) => (
              <button
                className={index === activeImage ? 'active' : ''}
                key={image.url}
                onClick={() => setActiveImage(index)}
                type="button"
              >
                <img src={image.url} alt={image.altText} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-panel">
          <span className="section-kicker">
            {product.brand} / {product.category}
          </span>
          <h1>{product.name}</h1>
          <p>{product.fullDescription}</p>
          <div className="detail-price-row">
            <strong>{formatCurrency(displayPrice)}</strong>
            {product.discountPrice && <del>{formatCurrency(product.price)}</del>}
          </div>
          <div className="detail-meta">
            <span>Rating {product.rating.toFixed(1)} / 5</span>
            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            className="primary-button wide-button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            type="button"
          >
            Add to cart
          </button>
          {cartMessage && <p className="form-message">{cartMessage}</p>}
        </div>
      </section>

      <section className="spec-section">
        <div className="section-heading">
          <span className="section-kicker">Details</span>
          <h2>Specifications</h2>
        </div>
        <div className="spec-grid">
          {product.specifications.map((specification) => (
            <div className="spec-row" key={specification.name}>
              <span>{specification.name}</span>
              <strong>{specification.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <span className="section-kicker">Related</span>
            <h2>More in {product.category}</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetailsPage;
