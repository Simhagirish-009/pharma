import React from 'react';
import { useNavigate } from 'react-router-dom';
// import projectlog from '../Assets/images/projectlog.png';
import girlbg from '../Assets/images/girlbg.jpg';
import med from '../Assets/images/girlbg.jpg';

const Openpage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/AdminUserLogin');
  };

  return (
    <div className="home-page">
      <video autoPlay muted loop className="background-video">
        <source src={med} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content-card">
        <div className="left-side">
          <div className="logo-container">
          <img src={projectlog} alt="Logo" className="logo" />

            <h1 className="title">PharmEsay</h1>
          </div>
          <p className="description">
            Welcome to Pharmesay! Your one-stop online pharmacy for all your medical needs. We offer a wide range of medicines and health products at your convenience.
          </p>
          <h2 className="features-title">Features:</h2>
          <ul className="features-list">
            <li>Wide selection of medicines</li>
            <li>Health products at your doorstep</li>
            <li>Expert consultation available</li>
            <li>24/7 customer support</li>
          </ul>
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        </div>

        <div className="right-side">
        <img src={girlbg} alt="Health Products" className="right-image" />
        </div>
      </div>
    </div>
  );
};

export default Openpage;
