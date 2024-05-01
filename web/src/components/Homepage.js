import React from 'react';
import '../styles/homepage.css';
import timeImg from '../assets/file.png';
import wave from "../assets/wave.svg";
import leftWave from "../assets/leftWave.png";
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
          <Link to={'/signup'} className="homebtn">
            Get Started
          </Link>
        </div>
        <img src={leftWave} className="image-fixed-left"/>
        <img src={timeImg} className="section-image" />
      </div>
      <img src={wave} className="wave" />

    </div>
  );
};

export default Homepage;
