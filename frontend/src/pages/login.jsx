import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/general/loginheader'; // Importa el nuevo topbar

const Login = () => {
    const [rut, setRut] = useState(''); // Estado para el RUT
    const [clave, setClave] = useState(''); // Estado para la contraseña
    const [error, setError] = useState(''); // Estado para manejar errores
    const navigate = useNavigate(); // Hook para redirección

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rut, clave }),
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            const data = await response.json();
            // Redirige al usuario según la ruta devuelta por el backend
            navigate(data.ruta);
        } catch (err) {
            setError(err.message); // Muestra el error en caso de fallo
        }
    };

    return (
        <>
            <LoginHeader /> {/* Usa el topbar específico para el login */}
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
                    {error && <p className="error-message">{error}</p>} {/* Muestra el error si existe */}
                    <button type="submit" className="login-button">Entrar</button>
                </form>
            </div>
        </>
    );
};

export default Login;