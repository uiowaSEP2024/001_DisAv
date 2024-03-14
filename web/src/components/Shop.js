import React from 'react';
import '../styles/rewards.css';
// Add your CSS import if needed

export const items = [
  { id: 1, name: 'Item 1', cost: 1000 },
  { id: 2, name: 'Item 2', cost: 500 },
  { id: 3, name: 'Item 3', cost: 200 },
  { id: 4, name: 'Item 4', cost: 1500 },
  // ... more shop items
];

const Shop = () => {
  // Fetch and render shop items data
  // For demonstration, using a static list
  // const [items,setItems] = useState('items');

  return (
    <div className="shop-items">
      {items.map(item => (
        <div key={item.id} className="shop-item">
          {/* Placeholder for the image. Replace with <img> if you have images. */}
          <div className="image-placeholder"></div>
          <h3>{item.name}</h3>
          <p>{item.cost} points</p>
          <button className="purchase-btn">Purchase</button>
        </div>
      ))}
    </div>
  );
};

export default Shop;
