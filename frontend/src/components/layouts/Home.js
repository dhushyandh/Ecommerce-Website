import { Fragment } from "react/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import MetaData from "./MetaData";
import { getProducts } from "../../actions/productAction";
import Loader from "./Loader";
import Products from "../product/Products";
import { toast } from "react-toastify";
import Pagination from 'react-js-pagination';


export default function Home() {

  const dispatch = useDispatch();
  const { products = [], loading = false, error = null, productsCount = 0, resPerPage = 0 } = useSelector(state => state.productsState || {});
  const [currentPage, setCurrentPage] = useState(1);

  const setCurrentPageNo = (pageNo) => {

    setCurrentPage(pageNo);
  }


  useEffect(() => {

    if (error) {
      toast.error(error, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "light",
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeOnClick: true
      })
      return;
    }



    dispatch(getProducts(null, null, null,null, currentPage));
  }, [error, dispatch, currentPage])


  return (

    <Fragment>
      {loading ? <Loader /> :
        <Fragment>
          <MetaData title={'Buy Products Here!'} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5 ui-container">
            <div className="products-grid ui-grid-row">
              {products && products.map(product => (
                <Products key={product._id} product={product} />
              ))}

            </div>
          </section>
          {productsCount > 0 && productsCount > resPerPage ?
            <div className="d-flex justify-content-center mt-5 ui-center">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={"page-item"}
                linkClass={"page-link"}
              />
            </div> : null}
        </Fragment>
      }
    </Fragment>
  )
}