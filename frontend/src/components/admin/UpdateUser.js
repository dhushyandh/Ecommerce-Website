import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { getUser, updateUser } from "../../actions/userActions";


export default function UpdateUser() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const { id: userId } = useParams();


    const { loading, isUserUpdated = false, error, user } = useSelector(state => state.userState);

    const dispatch = useDispatch();
    useEffect(() => {
        if (isUserUpdated) {
            toast('User Updated Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => dispatch(clearUserUpdated())
            })
            return;
        }
        if (error) {
            toast(error, {
                position: "bottom-right",
                type: 'error',
                theme: "light",
                onOpen: () => { dispatch(clearError()) }
            })
            return;
        }
        dispatch(getUser(userId));
    }, [dispatch, isUserUpdated, error])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("role", role);

        dispatch(updateUser(userId, formData));
    }
    useEffect(() => {
        if (user._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user])




    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Email</label>
                                <input
                                    type="email"
                                    id="price_field"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category_field">Role</label>
                                <select className="form-control" id="category_field" value={role} onChange={e => setRole(e.target.value)}  >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            
                            <button
                                id="login_button"
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading}
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </Fragment>
            </div>
        </div>

    )
}