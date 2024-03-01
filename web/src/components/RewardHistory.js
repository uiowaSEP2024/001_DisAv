import React from 'react';
import '../styles/rewards.css'; // Path to your CSS file

const RewardHistory = () => {
    // Fetch and render reward history data
    // For demonstration, using a static list
    const history = [
        { date: '2024-02-29', earnings: '500', task: 'Task 1' },
        // { date: '2024-02-26', earnings: '250', task: 'Task 2' },
        // ... more history items
    ];

    return (
        <div className="reward-history">
            {history.map((item, index) => (
                <div key={index} className="history-item">
                    <p>Completed: {item.task} on {item.date}: Earned {item.earnings} points</p>
                </div>
            ))}
        </div>
    );
};

export default RewardHistory;
