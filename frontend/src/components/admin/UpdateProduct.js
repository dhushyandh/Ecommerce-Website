import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productAction";
import { toast } from "react-toastify";
import { clearError, clearProductUpdated } from "../../slices/productSlice";


export default function UpdateProduct() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);
    const { id: productId } = useParams();


    const { loading, isProductUpdated = false, error, product } = useSelector(state => state.productState);

    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    const dispatch = useDispatch();

    useEffect(() => {
        if (isProductUpdated) {
            toast('Product Updated Successfully !', {
                type: 'success',
                theme: 'light',
                position: 'bottom-right',
                onOpen: () => dispatch(clearProductUpdated())
            })
            return;
            setImages([]);
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
        dispatch(getProduct(productId));
    }, [dispatch, isProductUpdated, error])

    useEffect(() => {
        if (product._id) {
            setName(product.name);
            setPrice(product.price);
            setStock(product.stock);
            setDescription(product.description);
            setSeller(product.seller);
            setCategory(product.category);

            let images = [];
            if (product.images && product.images.length > 0) {
                product.images.forEach(img => {
                    images.push(img.image);
                });
            }
            setImagesPreview(images);
        }
    }, [product])


    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);

                }
            }
            reader.readAsDataURL(file);
        })
    }



    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("stock", stock);
        formData.set("description", description);
        formData.set("seller", seller);
        formData.set("category", category);
        images.forEach(image => {
            formData.append("images", image)
        })
        formData.set("imagesCleared", imagesCleared);
        dispatch(updateProduct(productId, formData));
    }
    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    }


    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">Update Product</h1>

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
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    onChange={e => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description_field"
                                    rows="8"
                                    onChange={e => setDescription(e.target.value)}
                                    value={description}></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select className="form-control" id="category_field" value={category} onChange={e => setCategory(e.target.value)}  >
                                    <option value="">Select</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    onChange={e => setStock(e.target.value)}
                                    value={stock}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Seller Name</label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    onChange={e => setSeller(e.target.value)}
                                    value={seller}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.length > 0 &&
                                    <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}><i className="fa fa-trash"></i></span>
                                }
                                {imagesPreview.map(image => (
                                    <img
                                        className="mt-3 mr-2"
                                        key={image}
                                        src={image}
                                        alt={"Image Preview"}
                                        width="55px"
                                        height="52px" />
                                ))}
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