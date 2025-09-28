import React from "react";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/track-expense", imgSrc: "/images/track.jpeg", alt: "Track Expense" },
  { path: "/generate-plan", imgSrc: "/images/plan.jpeg", alt: "Generate Plan" },
  { path: "/previous-plans", imgSrc: "/images/previous.png", alt: "Previous Plans" },
];

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/'); // MODIFIED: Navigates to the home page after logout
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Expense Monitor</h1>
      <div className="nav-grid">
        {navItems.map(({ path, imgSrc, alt }) => (
          <Link to={path} key={path} className="nav-card">
            <img src={imgSrc} alt={alt} className="nav-card-image" />
            <div className="nav-card-title">{alt}</div>
          </Link>
        ))}

        {/* Conditionally render Login or Logout card */}
        {isLoggedIn ? (
          <div className="nav-card" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <img src="/images/login.jpeg" alt="Logout" className="nav-card-image" />
            <div className="nav-card-title">Logout</div>
          </div>
        ) : (
          <Link to="/login" className="nav-card">
            <img src="/images/login.jpeg" alt="Login" className="nav-card-image" />
            <div className="nav-card-title">Login</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;