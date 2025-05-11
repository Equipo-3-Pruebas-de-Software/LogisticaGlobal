import { useNavigate } from 'react-router-dom'; 
import LoginHeader from '../components/general/loginheader';
import '../stylesheets/login.css'; // Asegúrate de tener los estilos


const AccessDenied = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    return (
        <>
            <LoginHeader />
            <div className="login-container">
                <div className='extra-pages-container'>
                    <h1>Acceso Denegado</h1>
                    <p>No tienes permiso para acceder a esta página.</p>

                    <button onClick={handleBack}>
                        Volver al inicio
                    </button>
                </div>
    
            </div>
            
        </>
    );
};

export default AccessDenied;