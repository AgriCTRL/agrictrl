import "primereact/resources/themes/saga-blue/theme.css";
import 'primereact/resources/primereact.min.css';
import "primeicons/primeicons.css";

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Pages/App.jsx';
import './index.css';

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')).render(
    <PrimeReactProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </PrimeReactProvider>
);