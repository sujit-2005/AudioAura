import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import { getProducts } from '../../api/productService';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import FilterSidebar from '../../components/product/FilterSidebar';
import Pagination from '../../components/product/Pagination';
import ProductCard from '../../components/product/ProductCard';
import SearchBar from '../../components/product/SearchBar';
import SortSelect from '../../components/product/SortSelect';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
  sort: 'newest',
  page: '1',
};

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [catalog, setCatalog] = useState({
    products: [],
    page: 1,
    totalPages: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(DEFAULT_FILTERS).map(([key, fallback]) => [
          key,
          searchParams.get(key) || fallback,
        ]),
      ),
    [searchParams],
  );

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);

          Object.entries(changes).forEach(([key, value]) => {
            const defaultValue = DEFAULT_FILTERS[key];

            if (!value || value === defaultValue) {
              nextParams.delete(key);
            } else {
              nextParams.set(key, String(value));
            }
          });

          return nextParams;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(
            ([key, value]) =>
              value && !(key === 'sort' && value === DEFAULT_FILTERS.sort),
          ),
        );
        const result = await getProducts(params, controller.signal);

        setCatalog({
          products: result.data,
          page: result.page,
          totalPages: result.totalPages,
          totalProducts: result.totalProducts,
        });
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(
            requestError.response?.data?.message ||
              'The API is unavailable. Confirm that the AudioAura server is running.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [filters, requestKey]);

  const handleFilterChange = useCallback(
    (name, value) => {
      updateParams({ [name]: value, page: '1' });
    },
    [updateParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <>
      <section className="catalog-hero">
        <div className="page-shell">
          <span className="section-kicker">Curated listening</span>
          <h1>Find your sound.</h1>
          <p>
            Explore exceptional audio equipment, selected for how it feels—not
            just how it measures.
          </p>
          <SearchBar
            value={filters.search}
            onSearch={(value) => handleFilterChange('search', value)}
          />
        </div>
      </section>

      <main className="catalog page-shell" id="catalog">
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onClear={clearFilters}
        />

        <section className="catalog-results" aria-live="polite">
          <div className="catalog-toolbar">
            <div>
              <span className="section-kicker">The collection</span>
              <h2>
                {loading
                  ? 'Discovering products…'
                  : `${catalog.totalProducts} ${
                      catalog.totalProducts === 1 ? 'product' : 'products'
                    }`}
              </h2>
            </div>
            <SortSelect
              value={filters.sort}
              onChange={(value) => handleFilterChange('sort', value)}
            />
          </div>

          {loading && <LoadingState />}
          {!loading && error && (
            <ErrorState
              message={error}
              onRetry={() => setRequestKey((key) => key + 1)}
            />
          )}
          {!loading && !error && catalog.products.length === 0 && (
            <EmptyState onClear={clearFilters} />
          )}
          {!loading && !error && catalog.products.length > 0 && (
            <>
              <div className="product-grid">
                {catalog.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                page={catalog.page}
                totalPages={catalog.totalPages}
                onPageChange={(page) => updateParams({ page })}
              />
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default ProductListingPage;
