import { createContext, useState, useContext , useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        // Verificar si hay un usuario guardado en localStorage
        const storedUser = localStorage.getItem('usuario');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
            localStorage.removeItem('usuario');
        }
    }, [usuario]);

    const handleLogout = () => {
        setUsuario(null);
    };

    return (
        <UserContext.Provider value={{ usuario, setUsuario, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);