import PropTypes from 'prop-types';

const EmptyState = ({ onClear }) => (
  <div className="catalog-state">
    <div className="catalog-state__icon" aria-hidden="true">
      0
    </div>
    <h2>No products found</h2>
    <p>Try widening your price range or removing one of the filters.</p>
    <button className="primary-button" type="button" onClick={onClear}>
      Clear filters
    </button>
  </div>
);

EmptyState.propTypes = {
  onClear: PropTypes.func.isRequired,
};

export default EmptyState;
