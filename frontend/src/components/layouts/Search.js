import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Search() {



  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("")
  const { isAuthenticated } = useSelector(state => state.authState || {});

  const searchHandler = (e) => {
    e.preventDefault();
    if (location.pathname === '/login' && !isAuthenticated) {
      toast.info('Please login to access', { position: 'bottom-right' });
      return;
    }
    navigate(`/search/${keyword}`)
  }


  const clearKeyword = () => {
    setKeyword("");

  }
  useEffect(() => {
    if (location.pathname === "/") {
      clearKeyword();
    }
  }, [location.pathname])

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          onChange={(e) => { setKeyword(e.target.value) }}
          value={keyword}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  )
}