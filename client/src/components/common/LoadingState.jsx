const LoadingState = () => (
  <div className="product-grid" aria-label="Loading products" aria-busy="true">
    {Array.from({ length: 6 }, (_, index) => (
      <div className="product-skeleton" key={index}>
        <div className="product-skeleton__image" />
        <div className="product-skeleton__line product-skeleton__line--small" />
        <div className="product-skeleton__line" />
        <div className="product-skeleton__line product-skeleton__line--short" />
      </div>
    ))}
  </div>
);

export default LoadingState;
