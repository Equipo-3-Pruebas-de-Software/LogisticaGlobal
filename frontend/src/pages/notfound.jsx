import { useNavigate } from 'react-router-dom'; 
import LoginHeader from '../components/general/loginheader';
import '../stylesheets/login.css'; // Asegúrate de tener los estilos


const NotFound = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    return (
        <>
            <LoginHeader />
            <div className="login-container">
                <div className='extra-pages-container'>
                    <h1>404</h1>
                    <h2>Página No Encontrada</h2>
                    <p>La página que buscas no existe.</p>

                    <button onClick={handleBack}>
                        Volver al inicio
                    </button>
                </div>
    
            </div>
            
        </>
    );
};

export default NotFound;