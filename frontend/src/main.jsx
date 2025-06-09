import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './stylesheets/index.css';
import App from './App';
import { UserProvider } from './context/UserContext'; // Importa el proveedor
//prueba2
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <App />
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>
);