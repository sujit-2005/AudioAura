import { Link } from 'react-router-dom';

import ProductCard from '../../components/product/ProductCard';
import { useEffect, useState } from 'react';
import { getProducts } from '../../api/productService';

const categories = [
  'Headphones',
  'Earbuds',
  'Speakers',
  'Soundbars',
  'DACs',
  'Amplifiers',
  'Microphones',
  'Accessories',
];

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    getProducts({ sort: 'rating_desc', limit: 4 })
      .then((response) => setBestSellers(response.data))
      .catch(() => setBestSellers([]));
  }, []);

  return (
    <>
      <section className="home-hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1600&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-close-up-of-a-speaker-7565/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="home-hero__content page-shell">
          <span className="section-kicker">AudioAura</span>
          <h1>Premium sound, quietly curated.</h1>
          <p>
            Discover headphones, speakers, DACs, and studio gear chosen for
            immersive listening and beautiful everyday use.
          </p>
          <Link className="primary-button" to="/products">
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="section-heading">
          <span className="section-kicker">Best sellers</span>
          <h2>Customer favorites</h2>
        </div>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="section-heading">
          <span className="section-kicker">Browse</span>
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-tile"
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="page-shell benefits-grid">
          <article>
            <h3>Expertly selected</h3>
            <p>Every product is chosen for sound, reliability, and daily feel.</p>
          </article>
          <article>
            <h3>Fast fake checkout</h3>
            <p>Practice the complete ecommerce journey without real payments.</p>
          </article>
          <article>
            <h3>Portfolio-ready</h3>
            <p>Built with real API, cart, orders, auth, and admin architecture.</p>
          </article>
        </div>
      </section>

      <section className="page-shell newsletter-section">
        <span className="section-kicker">Stay tuned</span>
        <h2>Get product drops and listening notes.</h2>
        <form>
          <input type="email" placeholder="you@example.com" aria-label="Email" />
          <button className="primary-button" type="submit">
            Join
          </button>
        </form>
      </section>
    </>
  );
};

export default HomePage;
