import { createContext, useState, useContext } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

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