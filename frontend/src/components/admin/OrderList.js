import { useEffect, Fragment } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { clearError } from "../../slices/productsSlice";
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify';
import { MDBDataTable } from 'mdbreact';
import Sidebar from "./Sidebar";
import { clearOrderDeleted } from "../../slices/orderSlice";
import { adminOrders as adminOrdersAction, deleteOrderAction} from "../../actions/orderActions";

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted = false } = useSelector(state => state.orderState);
    const dispatch = useDispatch();

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Number Of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                },
                {
                    label: 'Status',
                    field: 'status',
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
        adminOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `₹${order.totalPrice}`,
                status: <p style={{ color: order.orderStatus.includes("Processing") ? 'red' : 'green' }}>{order.orderStatus}</p>,
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary btn-icon" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </Link>
                        <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2 btn-icon" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        </Button>
                    </Fragment>
                )
            })
        })
        return data;
    }

    const deleteHandler = (e, id) => {
        if (!window.confirm('Delete this order? This action cannot be undone.')) {
            return;
        }

        const btn = e.currentTarget;
        if (btn) btn.disabled = true;
        dispatch(deleteOrderAction(id));
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
        if (isOrderDeleted) {
            toast('Order Deleted Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => dispatch(clearOrderDeleted())
            })
            return;
        }

        dispatch(adminOrdersAction());
    }, [dispatch, error, isOrderDeleted])
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Orders List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setOrders()}
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