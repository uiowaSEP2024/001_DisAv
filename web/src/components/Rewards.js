import React, { useState } from 'react';
import RewardHistory from './RewardHistory'; // Path to your RewardHistory component
import '../styles/rewards.css'; // Ensure the CSS file is updated accordingly

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [totalPoints, setTotalPoints] = useState(0);
  return (
    <div className="rewards-container">
      <h1>Your Rewards</h1>
      <div className="points-display">You have earned {totalPoints} points</div>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'history' && <RewardHistory setTotalPoints={setTotalPoints} />}
      </div>
    </div>
  );
};

export default Rewards;
