import React, { useState } from 'react';
import RewardHistory from './RewardHistory'; // Path to your RewardHistory component
import Shop from './Shop'; // Path to your Shop component
import '../styles/rewards.css'; // Ensure the CSS file is updated accordingly

const RewardsScreen = () => {
    const [activeTab, setActiveTab] = useState('history');

    return (
        <div className="rewards-container">
            <h1>Your Rewards</h1>
            <div className="points-display">You have earned ... points</div>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
                {/* <button
                    className={`tab-button ${activeTab === 'shop' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shop')}
                >
                    Shop
                </button> */}
            </div>
            <div className="tab-content">
                {activeTab === 'history' && <RewardHistory />}
                {/* {activeTab === 'shop' && <Shop />} */}
            </div>
        </div>
    );
};

export default RewardsScreen;
