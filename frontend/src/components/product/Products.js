import { Link } from "react-router-dom";

export default function Products({product}) {
  return (
    <div className="product-item my-3">
      <div className="card p-3 rounded ui-card">
        <Link to={`/product/${product._id}`} className="card-media">
          <img
            className="card-img-top"
            src={product.images[0].image}
            alt={product.name}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>
          <div className="ratings mt-auto ui-ratings">
            <div className="rating-outer ui-rating-outer">
              <div className="rating-inner ui-rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
            </div>
            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
          </div>
          <p className="card-text ui-price">₹{product.price}</p>
          <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block ui-cta ui-btn">View Details</Link>
        </div>
      </div>
    </div>
  )
}