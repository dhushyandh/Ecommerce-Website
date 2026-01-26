import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productAction";
import { toast } from "react-toastify";
import { clearError, clearProductCreated } from "../../slices/productSlice";

export default function NewProduct() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, isProductCreated, error } = useSelector(
        state => state.productState
    );

    const categories = [
        "Electronics",
        "Mobile Phones",
        "Laptops",
        "Accessories",
        "Sports",
        "Home",
        "Clothing",
        "Footwear",
        "Headphones"
    ];

    useEffect(() => {
        if (isProductCreated) {
            toast("Product Created Successfully!", {
                type: "success",
                theme: "dark",
                position: "bottom-right",
                onOpen: () => dispatch(clearProductCreated())
            });
            navigate("/admin/products");
        }

        if (error) {
            toast(error, {
                type: "error",
                theme: "light",
                position: "bottom-right",
                onOpen: () => dispatch(clearError())
            });
        }
    }, [dispatch, isProductCreated, error, navigate]);

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(old => [...old, reader.result]);
                    setImages(old => [...old, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("seller", seller);
        formData.append("stock", stock);

        images.forEach(image => {
            formData.append("images", image);
        });

        dispatch(createNewProduct(formData));
    };

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form
                            onSubmit={submitHandler}
                            className="shadow-lg"
                            encType="multipart/form-data"
                        >
                            <h1 className="mb-4">New Product</h1>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows="6"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-control"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stock}
                                    onChange={e => setStock(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Seller</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={seller}
                                    onChange={e => setSeller(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    multiple
                                    onChange={onImagesChange}
                                />
                                {imagesPreview.map(img => (
                                    <img
                                        key={img}
                                        src={img}
                                        alt="preview"
                                        width="55"
                                        height="52"
                                        className="mt-2 mr-2"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading}
                            >
                                CREATE
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}
