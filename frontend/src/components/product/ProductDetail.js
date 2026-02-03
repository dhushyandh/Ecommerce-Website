import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { createReview, getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { addCartItem } from "../../actions/cartActions";
import { Modal } from 'react-bootstrap'
import { toast } from "react-toastify";
import { clearReviewSubmitted, clearError, clearProduct } from '../../slices/productSlice';
import ProductReview from "./ProductReview";

export default function ProductDetail() {

    const productState = useSelector((state) => state.productState || {});
    const product = productState.product || {};
    const loading = productState.loading ?? false;
    const isReviewSubmitted = productState.isReviewSubmitted ?? false;
    const error = productState.error ?? null;
    const { user } = useSelector((state) => state.authState);

    const dispatch = useDispatch();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const increaseQuantity = () => {
        const stock = product?.stock ?? 0;
        setQuantity(prev => {
            const next = prev + 1;
            if (stock === 0) return prev;
            return next > stock ? stock : next;
        });
    }
    const decreaseQuantity = () => {
        setQuantity(prev => {
            const next = prev - 1;
            return next < 1 ? 1 : next;
        });
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const reviewHandler = () => {
        const payload = {
            rating,
            comment,
            productId: id
        };

        dispatch(createReview(payload));
    };


    useEffect(() => {

        if (isReviewSubmitted) {
            handleClose();
            toast('Review Submitted Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => { dispatch(clearReviewSubmitted()) }
            })
            if (error) {
                toast.error(error, {
                    position: 'bottom-right',
                    onOpen: () => { dispatch(clearError()) }
                });
            }

        }
        if (!product._id || isReviewSubmitted || product._id !== id) {
            dispatch(getProduct(id));

            return () => {
                dispatch(clearProduct());
            }
        }
        setSelectedImageIndex(0);
    }, [id, dispatch, isReviewSubmitted, error]);




    return (
        <Fragment>
            {(loading || !product || !product._id) ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={product?.name || 'Product'} />

                    <div className="product-detail container">
                        <div className="product-gallery" id="product_image">
                            <img
                                src={product?.images && product.images.length > 0 ? product.images[selectedImageIndex].image : '/images/default.png'}
                                alt={product?.name}
                                className="img-fluid"
                            />

                            {product?.images && product.images.length > 1 ? (
                                <div className="thumbnails">
                                    {product.images.map((img, i) => (
                                        <img
                                            key={img.image + i}
                                            src={img.image}
                                            alt={`${product?.name}-${i}`}
                                            className={`thumb ${i === selectedImageIndex ? 'active' : ''}`}
                                            onClick={() => setSelectedImageIndex(i)}
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="product-info">
                            <div className="product-main">
                                <h3>{product?.name}</h3>
                                <p id="product_id">{product?._id}</p>

                                <div className="rating-row">
                                    <div className="rating-outer">
                                        <div className="rating-inner" style={{ width: `${(product?.ratings ?? 0) / 5 * 100}%` }}></div>
                                    </div>
                                    <span id="no_of_reviews">({product?.numOfReviews ?? 0} Reviews)</span>
                                </div>

                                <div className="price-box mt-3">
                                    <div className="price">₹{product?.price ?? 0}</div>
                                    <div className="stock-info">Status: <span className={((product?.stock ?? 0) > 0) ? 'greenColor' : 'redColor'} id="stock_status">{(product?.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}</span></div>

                                    <div className="product-buy-row mt-2">
                                        <div className="stockCounter">
                                            <button className="btn btn-ghost minus" onClick={decreaseQuantity}>-</button>
                                            <input type="number" className="form-control count" value={quantity} readOnly />
                                            <button className="btn btn-ghost plus" onClick={increaseQuantity}>+</button>
                                        </div>
                                        <button type="button" id="cart_btn" disabled={(product?.stock ?? 0) === 0}
                                            onClick={() => {
                                                toast('Item Added To Cart !', {
                                                    type: 'success',
                                                    theme: 'light',
                                                    position: 'bottom-right',
                                                });
                                                dispatch(addCartItem(product?._id, quantity));
                                            }} className="btn add-btn">Add to Cart</button>
                                    </div>
                                </div>

                                <div className="product-description">
                                    <h4>Description</h4>
                                    <p>{product?.description}</p>
                                    <p className="mt-2">Sold by: <strong>{product?.seller}</strong></p>
                                    {user ? (
                                        <button id="review_btn" type="button" onClick={handleShow} className="btn mt-3 ui-btn" data-toggle="modal" data-target="#ratingModal">
                                            Submit Your Review
                                        </button>
                                    ) : (
                                        <div className="alert alert-danger mt-3">Login To Post Your Review.</div>
                                    )}
                                </div>
                            </div>

                            <Modal
                                show={show}
                                onHide={handleClose}
                                centered
                                size="md"
                                dialogClassName="review-modal"
                            >
                                <Modal.Header closeButton className="review-modal-header">
                                    <Modal.Title>Write a Review</Modal.Title>
                                </Modal.Header>

                                <Modal.Body className="review-modal-body">

                                    {/* Rating */}
                                    <div className="rating-section">
                                        <p className="rating-label">Your Rating</p>

                                        <ul className="rating-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <li
                                                    key={star}
                                                    className={`star ${star <= rating ? 'active' : ''}`}
                                                    onClick={() => setRating(star)}
                                                >
                                                    <i className="fa fa-star" />
                                                </li>
                                            ))}
                                        </ul>

                                        <span className="rating-text">
                                            {["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    <div className="comment-section">
                                        <label>Your Review</label>
                                        <textarea
                                            rows="4"
                                            maxLength="500"
                                            placeholder="Share your experience with this product…"
                                            className="form-control review-textarea"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <small className="char-count">{comment.length}/500</small>
                                    </div>

                                </Modal.Body>

                                <Modal.Footer className="review-modal-footer">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-primary submit-review-btn"
                                        disabled={loading || comment.trim().length === 0}
                                        onClick={reviewHandler}
                                    >
                                        Submit Review
                                    </button>
                                </Modal.Footer>
                            </Modal>

                        </div>
                    </div>

                    {product?.reviews && product.reviews.length > 0 ? <ProductReview reviews={product.reviews} /> : null}
                </Fragment>
            )}
        </Fragment>
    );
}