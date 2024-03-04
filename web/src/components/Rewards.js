import React, { useState } from 'react';
import RewardHistory from './RewardHistory'; // Path to your RewardHistory component
import Shop from './Shop'; // Path to your Shop component
import '../styles/rewards.css'; // Ensure the CSS file is updated accordingly
import axios from 'axios';

const RewardsScreen = () => {
    const [activeTab, setActiveTab] = useState('history');
    // const createTask = async () => {
    //     const taskDetails = {
    //       username: 'adnane', // Replace with the actual username
    //       taskType: 'Break',
    //       date: '2024-03-01',
    //       startTime: '10:00 AM',
    //       endTime: '11:00 AM',
    //       duration: 60,
    //       points: 250,
    //     };

    //     try {
    //       const response = await axios.post('http://localhost:3002/task/create', taskDetails);
    //       console.log("her",response.data); // Output the response data
    //     } catch (error) {
    //       console.error('Error creating task:', error);
    //     }
    //   };
    //   createTask();
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
