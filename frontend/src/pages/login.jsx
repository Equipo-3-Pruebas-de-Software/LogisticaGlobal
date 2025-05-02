import React from 'react';
import './login.css';
import LoginHeader from '../components/general/loginheader'; // Importa el nuevo topbar

const Login = () => {
    return (
        <>
            <LoginHeader /> {/* Usa el topbar específico para el login */}
            <div className="login-container">
                <form className="login-form">
                    <h1 className="company-title">LogisticaGlobal</h1>
                    <h1>Iniciar Sesión</h1>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="Ingresa tu correo" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Ingresa tu contraseña" required />
                    </div>
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            </div>
        </>
    );
};

export default Login;