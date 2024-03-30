import React from 'react';
import '../styles/homepage.css';
import timeImg from '../assets/timeglass.jpeg';
import { Link } from 'react-router-dom';
const Homepage = () => {
  return (
    <div className="homepage" data-testid="homepage">
      <div className="welcome-section">
        <div className="text">
          <h4 className="intro">Maximize Productivity</h4>
          <h1 className="name">Break the Doomscrolling Cycle with Infinite Focus</h1>
          <p className="bio">
            Rediscover the power of concentration and reclaim your time. Infinite Focus is your
            digital companion in the quest for productivity, guiding you away from the endless
            scroll and towards meaningful engagement with your tasks. Whether it's time to stretch,
            hydrate, or dive into a good book, Infinite Focus gently nudges you back on track.
            Embrace the full potential of every moment — because your attention is invaluable.
          </p>
          <Link to={'/signup'}>
            <button className="btn">Get Started</button>
          </Link>
        </div>
        <img src={timeImg} className="section-image" />
      </div>
      {/*<div className="grid-container">*/}
      {/*  <div className="grid-item welcome-section">*/}
      {/*  <h1>Welcome to Infinite Focus</h1>*/}
      {/*  <img src={FocusImage} alt="Focus" className="section-image"/>*/}

      {/*    <p>Your gateway to enhanced productivity and mental wellness.</p>*/}
      {/*  </div>*/}
      {/*  <div className="grid-item problem-section">*/}
      {/*  <h2>The Problem of Doomscrolling</h2>*/}
      {/*    /!* <img src={DoomscrollingImage} alt="Doomscrolling" className="section-image"/> *!/*/}
      {/*    <p>Excessive scrolling through negative news leads to increased stress.</p>*/}
      {/*  </div>*/}
      {/*  <div className="grid-item solution-section">*/}
      {/*    <img src={SolutionImage} alt="Solution" className="section-image"/>*/}
      {/*    <h2>Our Solution</h2>*/}
      {/*    <p>Innovative features to keep you focused and efficient.</p>*/}
      {/*  </div>*/}
      {/*  <div className="grid-item how-to-section">*/}
      {/*    <img src={HowToImage} alt="How to" className="section-image"/>*/}
      {/*    <h2>How to</h2>*/}
      {/*    <p>Simple steps to integrate Infinite Focus into your daily routine.</p>*/}
      {/*  </div>*/}
      {/*  <div className="grid-item join-section">*/}
      {/*    <img src={JoinImage} alt="Join" className="section-image"/>*/}
      {/*    <h2>Join the Movement</h2>*/}
      {/*    <p>Be part of the community striving for a balanced digital life.</p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default Homepage;
