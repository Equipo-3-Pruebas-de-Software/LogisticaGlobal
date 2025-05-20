import { useState} from 'react';
import { useUser } from '../../../context/UserContext';

export const Layout = ({enlaces, main}) => {

  const [isNavOnly, setIsNavOnly] = useState(false);
  const { usuario } = useUser();

  const toggleNavOnly = () => {
    setIsNavOnly(!isNavOnly);
  };

  return (
    <div className="layout">
      <header className="header">
        <h1>LogísticaGlobal.com</h1>
        <button onClick={toggleNavOnly}>
          {!isNavOnly && 
            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
          }
          {isNavOnly &&
            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
          }
          </button>
        
      </header>
      <div className="content">
        <nav className={`${isNavOnly ? 'nav-mobile' : 'nav'}`}>
          <p>{usuario.nombre}</p>
          {enlaces}
        </nav>
        {!isNavOnly && <main>{main}</main>}
      </div>
    </div>
    
  )
}

export default Layout

  