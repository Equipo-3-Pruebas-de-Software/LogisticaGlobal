import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import LoginHeader from '../components/general/loginheader';
import '../stylesheets/login.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

const Login = () => {
    const [rut, setRut] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUsuario } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://192.168.77.15:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rut, clave }),
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            const data = await response.json();

            // Guarda los datos del usuario en el contexto
            setUsuario(data.usuario);

            // Redirige al usuario según la ruta devuelta por el backend
            navigate(data.ruta);
        } catch (err) {
            setError({ type: 'error', text: err.message || 'No se pudo acceder' });

        }
    };

    return (
        <>
            <LoginHeader />
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="company-title">LogísticaGlobal.com</h1>
                    <h2>Iniciar Sesión</h2>
                    <div className="form-group">
                        <label htmlFor="rut">RUT</label>
                        <InputText id="rut" value={rut} required placeholder="Ingresa tu RUT" onChange={(e) => setRut(e.target.value)}/>
                        <p>Sin puntos y con guion</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <InputText type="password" id="password" value={clave} required placeholder="Ingresa tu contraseña" onChange={(e) => setClave(e.target.value)}/>
                    </div>
                    <Button type="submit" label="Entrar" className='login-button'/>
                    {error && (
                        <Message severity={error.type} text={error.text} className='msg' style={{ width: '100%' , position: "relative" , zIndex: "999" }}/>
                    )}
                </form>
            </div>
        </>
    );
};

export default Login;
