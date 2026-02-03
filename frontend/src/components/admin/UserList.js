import { useEffect, Fragment } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify';
import { MDBDataTable } from 'mdbreact';
import Sidebar from "./Sidebar";
import { deleteUser, getUsers } from "../../actions/userActions";

export default function UserList() {
    const { users = [], loading = true, error, isUserDeleted = false } = useSelector(state => state.userState);
    const dispatch = useDispatch();

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                },
                {
                    label: 'Role',
                    field: 'role',
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
        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary btn-icon" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </Link>
                        <Button onClick={e => deleteHandler(e, user._id)} className="btn btn-danger py-1 px-2 ml-2 btn-icon" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        </Button>
                    </Fragment>
                )
            })
        })
        return data;
    }

    const deleteHandler = (e, id) => {
        if (!window.confirm('Delete this user? This action cannot be undone.')) {
            return;
        }

        const btn = e.currentTarget;
        if (btn) btn.disabled = true;
        dispatch(deleteUser(id));
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
        if (isUserDeleted) {
            toast('User Deleted Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => dispatch(clearUserDeleted())
            })
            return;
        }

        dispatch(getUsers());
    }, [dispatch, error, isUserDeleted])
    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Users List</h1>
                <Fragment>
                    {loading ? <Loader /> :
                        <MDBDataTable
                            data={setUsers()}
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