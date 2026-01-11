import { Link } from "react-router-dom";

export default function Products({ product }) {
  const rawImage =
    product?.images?.length > 0 ? product.images[0].image : "";

  const backendBase = process.env.REACT_APP_BACKEND_URL || "";
  const imgSrc = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${backendBase}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`
    : "";

  return (
    <div className="col-6 col-md-4 col-lg-3 d-flex">
      <div className="product-item w-100">
        <div className="card ui-card h-100">
          <Link to={`/product/${product._id}`} className="card-media">
            <img src={imgSrc} alt={product.name} className="card-img-top" />
          </Link>

          <div className="card-body d-flex flex-column">
            <h6 className="card-title mb-2">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </h6>

            <div className="ratings mb-1">
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                />
              </div>
              <span id="no_of_reviews">
                ({product.numOfReviews} Reviews)
              </span>
            </div>

            <p className="ui-price mb-2">₹{product.price}</p>

            <Link
              to={`/product/${product._id}`}
              className="btn ui-btn ui-cta mt-auto"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
