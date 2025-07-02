import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/order');
  };

  return (
    <div className="home-container" onClick={handleClick}>
      <div className="home-content">
        <h1>Welcome to NutriSip</h1>
        <p className="subtitle">Your daily dose of health and wellness</p>
        <div className="benefits">
          <h2>Why Dry Fruits?</h2>
          <p>
            Dry fruits are a great source of proteins, vitamins, minerals, and dietary fiber. They are a delicious and healthy substitute for daily snacks. Including a handful of dry fruits in your diet can help you maintain a healthy lifestyle and prevent various diseases.
          </p>
          <p>
            From boosting your immunity to keeping your skin radiant, dry fruits offer a plethora of health benefits. They are packed with antioxidants and essential nutrients that are vital for your well-being.
          </p>
        </div>
        <p className="click-info">Click anywhere to continue to the store</p>
      </div>
    </div>
  );
};

export default Home;