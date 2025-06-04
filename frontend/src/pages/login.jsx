import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Importa el contexto
import LoginHeader from '../components/general/loginheader';
import '../stylesheets/login.css'; // Asegúrate de tener los estilos

const Login = () => {
    const [rut, setRut] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUsuario } = useUser(); // Obtén la función para actualizar el usuario

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://3.143.5.181:3000/api/auth/login', {
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
            setError(err.message);
        }
    };

    return (
        <>
            <LoginHeader />
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="company-title">LogisticaGlobal</h1>
                    <h1>Iniciar Sesión</h1>
                    <div className="form-group">
                        <label htmlFor="rut">RUT</label>
                        <input
                            type="text"
                            id="rut"
                            placeholder="Ingresa tu RUT"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Ingresa tu contraseña"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            </div>
        </>
    );
};

export default Login;
