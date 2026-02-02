import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/layouts/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/router/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgetPassword from './components/user/ForgetPassword';
import ResetPassword from './components/user/ResetPassword';
import { useDispatch } from 'react-redux';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import UserOrders from './components/order/UserOrders';
import OrderDetial from './components/order/OrderDetail';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ReviewList from './components/admin/ReviewList';
import BottomNav from './components/layouts/BottomNav';
import OAuthSuccess from "./components/user/OAuthSuccess";
import NotFound from './components/layouts/NotFound';
import About from './components/layouts/About';
import StripeCheckoutSuccess from './components/cart/StripeCheckoutSuccess';
import StripeCheckoutCancel from './components/cart/StripeCheckoutCancel';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);


  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className='container-fluid vip-container'>
            <ToastContainer />
            <Routes>
              <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path='/about' element={<About />} />
              <Route path='/search/:keyword' element={<ProductSearch />} />
              <Route path='/search' element={<ProductSearch />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/myprofile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
              <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
              <Route path='/password/forget' element={<ForgetPassword />} />
              <Route path='/password/reset/:token' element={<ResetPassword />} />
              <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
              <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
              <Route path='/order/success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path='/orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
              <Route path='/order/:id' element={<ProtectedRoute><OrderDetial /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/payment/success" element={<ProtectedRoute><StripeCheckoutSuccess /></ProtectedRoute>} />
              <Route path="/payment/cancel" element={<ProtectedRoute><StripeCheckoutCancel /></ProtectedRoute>} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
              <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
              <Route path='/admin/products/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
              <Route path='/admin/orders/' element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
              <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
              <Route path='/admin/users/' element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
              <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
              <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>} />

              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </HelmetProvider>
        <BottomNav />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
