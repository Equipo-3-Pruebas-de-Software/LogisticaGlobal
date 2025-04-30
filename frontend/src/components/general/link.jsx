// components/Link.jsx
import React from 'react';
import { NavLink } from 'react-router';

export const Link = ({ icon, link, text, style}) => {
  return (
    <NavLink end style={style} className="link" to={link}> {icon} 
      <span className="link-text">{text}</span>
    </NavLink>
  );
};

export default Link;

  