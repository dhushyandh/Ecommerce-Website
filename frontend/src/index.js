import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
axios.defaults.baseURL = apiUrl;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);

