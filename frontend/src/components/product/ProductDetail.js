import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { createReview, getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Carousel } from 'react-bootstrap';
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

    const increaseQuantity = () => {
        const count = document.querySelector('.count')
        const stock = product?.stock ?? 0;
        if (stock == 0 || count.valueAsNumber >= stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }
    const decreaseQuantity = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber == 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
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
    }, [id, dispatch, isReviewSubmitted, error]);




    return (
        <Fragment>
            {(loading || !product || !product._id) ? <Loader /> :
                <Fragment>
                    <MetaData title={product?.name || 'Product'} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {product.images && product.images.map(image =>
                                    <Carousel.Item key={image._id}>
                                        <img className="d-block w-100" src={image.image} alt={product?.name} height="500" width="500" />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product?.name}</h3>
                            <p id="product_id">{product?._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product?.ratings ?? 0) / 5 * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product?.numOfReviews ?? 0} Reviews)</span>

                            <hr />

                            <p id="product_price">₹{product?.price ?? 0}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQuantity}>-</span>

                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                <span className="btn btn-primary plus" onClick={increaseQuantity}>+</span>
                            </div>
                            <button type="button" id="cart_btn" disabled={(product?.stock ?? 0) == 0 ? true : false}
                                onClick={() => {
                                    toast('Item Added To Cart !', {
                                        type: 'success',
                                        theme: 'light',
                                        position: 'bottom-right',
                                    })
                                    dispatch(addCartItem(product?._id, quantity))
                                }
                                } className="btn btn-primary d-inline ml-4">Add to Cart</button>

                            <hr />

                            <p>Status: <span className={((product?.stock ?? 0) > 0) ? 'greenColor' : 'redColor'} id="stock_status">{(product?.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product?.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>
                            {user ?
                                <button id="review_btn" type="button" onClick={handleShow} className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                    Submit Your Review
                                </button> :
                                <div className="alert alert-danger mt-5">Login To Post Your Review.</div>
                            }
                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Submit Review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ul className="stars" >
                                                {
                                                    [1, 2, 3, 4, 5].map(star => (
                                                        <li
                                                            key={star}
                                                            value={star}
                                                            onClick={() => setRating(star)}
                                                            className={`star ${star <= rating ? 'orange' : ''}`}
                                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                                            onMouseOut={(e) => e.target.classList.remove('yellow')}
                                                        ><i className="fa fa-star"></i></li>

                                                    ))
                                                }
                                            </ul>

                                            <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3">

                                            </textarea></Modal.Body>
                                        <button aria-label="close" disabled={loading} onClick={reviewHandler} className="btn my-3 float-right review-btn px-4 text-white">Submit</button>
                                    </Modal>
                                </div>

                            </div>

                        </div>

                    </div>
                    {product?.reviews && product.reviews.length > 0 ?
                        <ProductReview reviews={product.reviews} /> : null}
                </Fragment>}
        </Fragment>
    )
}