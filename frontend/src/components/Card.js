// components/Card.js
import React from 'react';

const Card = ({ title, description, imageUrl }) => {
    return (
        <div className="card">
            <img src={imageUrl} alt={title} className="card-image" />
            <h3>{title}</h3>
            <h5>{description}</h5>
            {/* <button>Learn More</button> */}
        </div>
    );
};

export default Card;