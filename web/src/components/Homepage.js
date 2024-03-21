import React from 'react';
import '../styles/homepage.css';
import FocusImage from '../assets/FeatureImage.png'; // Placeholder image for the welcome section
import DoomscrollingImage from '../assets/doomscrolling.png'; // Placeholder image for the problem section
import SolutionImage from '../assets/solution.png'; // Placeholder image for the solution section
import HowToImage from '../assets/guide.png'; // Placeholder image for the how-to section
import JoinImage from '../assets/join-mouvement.png'; // Placeholder image for the join section

const Homepage = () => {
  return (
    <div className="homepage" data-testid="homepage">
      <div className="grid-container">
        <div className="grid-item welcome-section">
        <h1>Welcome to Infinite Focus</h1>
        <img src={FocusImage} alt="Focus" className="section-image"/>

          <p>Your gateway to enhanced productivity and mental wellness.</p>
        </div>
        <div className="grid-item problem-section">
        <h2>The Problem of Doomscrolling</h2>
          {/* <img src={DoomscrollingImage} alt="Doomscrolling" className="section-image"/> */}
          <p>Excessive scrolling through negative news leads to increased stress.</p>
        </div>
        <div className="grid-item solution-section">
          <img src={SolutionImage} alt="Solution" className="section-image"/>
          <h2>Our Solution</h2>
          <p>Innovative features to keep you focused and efficient.</p>
        </div>
        <div className="grid-item how-to-section">
          <img src={HowToImage} alt="How to" className="section-image"/>
          <h2>How to</h2>
          <p>Simple steps to integrate Infinite Focus into your daily routine.</p>
        </div>
        <div className="grid-item join-section">
          <img src={JoinImage} alt="Join" className="section-image"/>
          <h2>Join the Movement</h2>
          <p>Be part of the community striving for a balanced digital life.</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
