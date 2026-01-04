import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import axios from 'axios';


axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://16.170.249.115:8000/api';
axios.defaults.withCredentials = false;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);

