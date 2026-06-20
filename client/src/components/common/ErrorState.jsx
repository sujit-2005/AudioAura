import PropTypes from 'prop-types';

const ErrorState = ({ message, onRetry }) => (
  <div className="catalog-state catalog-state--error" role="alert">
    <div className="catalog-state__icon" aria-hidden="true">
      !
    </div>
    <h2>We couldn’t load the catalog</h2>
    <p>{message}</p>
    <button className="primary-button" type="button" onClick={onRetry}>
      Try again
    </button>
  </div>
);

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default ErrorState;
