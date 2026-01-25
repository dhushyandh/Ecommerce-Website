import { Link } from "react-router-dom";

export default function Products({ product }) {

  // ✅ Cloudinary already gives full URL
  const imgSrc =
    product?.images?.length > 0
      ? product.images[0].image
      : "/images/no-image.png"; // optional fallback

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className="product-item w-100">
        <div className="card ui-card h-100 shadow-sm rounded-3">

          <Link to={`/product/${product._id}`} className="card-media">
            <img
              src={imgSrc}
              alt={product.name}
              className="card-img-top product-img"
              loading="lazy"
            />
          </Link>

          <div className="card-body d-flex flex-column p-3">

            <h6 className="card-title product-title mb-2">
              <Link to={`/product/${product._id}`} className="text-dark">
                {product.name}
              </Link>
            </h6>

            <div className="ratings mb-2">
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                />
              </div>
              <span className="reviews-text">
                ({product.numOfReviews})
              </span>
            </div>

            <p className="ui-price mb-3 fw-bold">
              ₹{product.price}
            </p>

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
