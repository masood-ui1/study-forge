import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span>StudyForge</span>
        </Link>
        <div className="navbar-links">
          <NavLink to="/dashboard" className="navbar-link">Dashboard</NavLink>
          <NavLink to="/study-planner" className="navbar-link">Planner</NavLink>
          <NavLink to="/code-tutor" className="navbar-link">Tutor</NavLink>
          <NavLink to="/profile" className="navbar-link">Profile</NavLink>
          {user && <span className="navbar-user">{user.name}</span>}
          <button className="navbar-logout" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
