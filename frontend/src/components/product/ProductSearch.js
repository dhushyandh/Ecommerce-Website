import { Fragment } from "react/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { getProducts } from "../../actions/productAction";
import Loader from "../layouts/Loader";
import Products from "../product/Products";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';
import { useNavigate, useParams } from "react-router-dom";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products = [],
    loading = false,
    error = null,
    productsCount = 0,
    resPerPage = 0
  } = useSelector(state => state.productsState || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [priceChanged, setPriceChanged] = useState(price);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(0);
  

  // ✅ MOBILE ONLY STATE (desktop ignores this)
  const [showMobileResults, setShowMobileResults] = useState(false);

  const { keyword } = useParams();
  const isMobile = window.innerWidth <= 768;


  const isEmptySearch =
    (!keyword || keyword.trim() === "") &&
    !category &&
    rating === 0;

  const categories = [
    'Electronics',
    'Mobile Phones',
    'Laptops',
    'Accessories',
    'headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ];

  const popularSearches = [
    'wireless headphones',
    'gaming laptop',
    'smart watch',
    'running shoes',
    'coffee maker'
  ];

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "light"
      });
      return;
    }

    dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
  }, [dispatch, error, keyword, priceChanged, category, rating, currentPage]);

  return (
    <Fragment>
      {loading ? <Loader /> : (
        <Fragment>
          <MetaData title={'Buy Products Here!'} />

          {/* ================= EMPTY SEARCH (MOBILE CATEGORY SCREEN) ================= */}
          {isEmptySearch && isMobile && !showMobileResults ? (
            <div className="empty-search-ui mobile-only">
              <div className="empty-card">
                <div className="empty-hero">🔎</div>
                <h2>Explore categories & filters</h2>
                <p className="muted">Choose a category or rating to see products.</p>

                <div className="filters-grid">

                  <div className="filter-column">
                    <h4 className="filter-title">Categories</h4>
                    <ul className="pl-0">
                      {categories.map(cat => (
                        <li
                          key={cat}
                          className="filter-item"
                          onClick={() => {
                            setCategory(cat);
                            setCurrentPage(1);
                            setShowMobileResults(true);
                          }}
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="filter-column">
                    <h4 className="filter-title">Ratings</h4>
                    <ul className="pl-0">
                      {[5, 4, 3, 2, 1].map(star => (
                        <li
                          key={star}
                          className="filter-item rating-filter"
                          onClick={() => {
                            setRating(star);
                            setShowMobileResults(true);
                          }}
                        >
                          <div className="rating-outer small">
                            <div
                              className="rating-inner"
                              style={{ width: `${star * 20}%` }}
                            ></div>
                          </div>
                          <span>&nbsp;& up</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="popular-searches mt-4">
                  <h4 className="filter-title">Popular searches</h4>
                  <div className="tags">
                    {popularSearches.map(tag => (
                      <button
                        key={tag}
                        className="tag"
                        onClick={() => {
                          navigate(`/search/${encodeURIComponent(tag)}`);
                          setShowMobileResults(true);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ================= MOBILE BACK HEADER ================= */}
              <div className="mobile-back-header">
                <button onClick={() => {
                  setShowMobileResults(false);
                  setCategory(null);
                  setRating(0);
                }}>
                  ←
                </button>
                <span>Back</span>
              </div>

              <h1 id="products_heading">Search Results</h1>

              {/* ================= PRODUCTS SECTION (DESKTOP + MOBILE) ================= */}
              <section id="products" className="container mt-4">
                <div className="row">

                  {/* DESKTOP SIDEBAR (UNCHANGED) */}
                  <div className="col-6 col-md mb-5 mt-5 desktop-only">
                    <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                      <Slider
                        range
                        marks={{ 1: "₹1", 1000: "₹1000" }}
                        min={1}
                        max={1000}
                        defaultValue={price}
                        onChange={setPrice}
                        handleRender={renderProps => (
                          <Tooltip overlay={`₹${renderProps.props['aria-valuenow']}`}>
                            <div {...renderProps.props}></div>
                          </Tooltip>
                        )}
                      />
                    </div>

                    <hr className="my-5" />

                    <h3>Categories</h3>
                    <ul className="pl-0">
                      {categories.map(cat => (
                        <li
                          key={cat}
                          style={{ cursor: "pointer", listStyle: "none" }}
                          onClick={() => setCategory(cat)}
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>

                    <hr className="my-5" />

                    <h4>Ratings</h4>
                    <ul className="pl-0">
                      {[5, 4, 3, 2, 1].map(star => (
                        <li
                          key={star}
                          style={{ cursor: "pointer", listStyle: "none" }}
                          onClick={() => setRating(star)}
                        >
                          <div className="rating-outer">
                            <div
                              className="rating-inner"
                              style={{ width: `${star * 20}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PRODUCTS GRID */}
                  <div className="col-12 col-md-9">
                    <div className="row">
                      {products.map(product => (
                        <Products key={product._id} product={product} />
                      ))}
                    </div>
                  </div>

                </div>
              </section>

              {productsCount > resPerPage && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    activePage={currentPage}
                    onChange={setCurrentPageNo}
                    totalItemsCount={productsCount}
                    itemsCountPerPage={resPerPage}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
            </>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
