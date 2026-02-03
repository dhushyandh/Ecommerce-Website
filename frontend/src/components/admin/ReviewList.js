import { useEffect, Fragment, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify';
import { MDBDataTable } from 'mdbreact';
import Sidebar from "./Sidebar";
import { deleteReview, getReviews } from "../../actions/productAction";

export default function ReviewList() {
    const { reviews = [], loading = true, error, isReviewDeleted = false } = useSelector(state => state.productState);
    const [productId, setProductId] = useState("");
    const dispatch = useDispatch();

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc',
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc',
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
                },
            ],
            rows: [

            ]
        }
        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: (review.user && review.user.name) ? review.user.name : (typeof review.user === 'string' ? review.user : ''),
                comment: review.comment,
                actions: (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, review._id)} className="btn btn-danger py-1 px-2 ml-2 btn-icon" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        </Button>
                    </Fragment>
                )
            })
        })
        return data;
    }

    const deleteHandler = (e, id) => {
        if (!window.confirm('Delete this review? This action cannot be undone.')) {
            return;
        }

        const btn = e.currentTarget;
        if (btn) btn.disabled = true;
        dispatch(deleteReview(productId, id));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getReviews(productId));
    }


    useEffect(() => {
        if (error) {
            toast(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return;
        }
        if (isReviewDeleted) {
            toast('Review Deleted Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => dispatch(clearReviewDeleted())
            })
            return;
        }
    }, [dispatch, error, isReviewDeleted])
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">ReviewList</h1>
                <div className="row justify-content-center mt-5">
                    <div className="col-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label htmlFor="productId">Product ID</label>
                                <input
                                    type="text"
                                    id="productId"
                                    className="form-control"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary btn-block py-2" type="submit" disabled={loading}>Search</button>
                        </form>
                    </div>
                </div>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setReviews()}
                            bordered
                            striped
                            hover
                            className="px-3"
                        />
                    }
                </Fragment>
            </div>
        </div>
    )
}