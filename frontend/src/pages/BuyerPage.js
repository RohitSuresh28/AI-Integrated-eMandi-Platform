import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css'
import './farmerstyles.css'
import { useNavigate } from 'react-router-dom';

const BuyerPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', address: '' });
    const [bid, setBid] = useState({ produce_id: '', buyer_id: '', bid_amount: '' });
    const [produceList, setProduceList] = useState([]);
    const [bidList, setBidList] = useState([]);  // State for storing placed bids
    const [error, setError] = useState(null);
    // Fetch the produce list from the backend
    const nameValidationRegex = /^[A-Za-z\s]+$/;
    const validateForm = () => {
        if (typeof form.name !== 'string' || form.name.trim() === '' || !nameValidationRegex.test(form.name)) {
            return 'Name must be a non-empty string with no numbers.';
        }
        // if (typeof form.address !== 'string' || form.address.trim() === '') {
        //     return 'Address must be a non-empty string.';
        // }
        return null;
    };
    const validateBid = () => {
        if (typeof bid.produce_id !== 'string' || bid.produce_id.trim() === '') {
            return 'Produce ID must be a non-empty string.';
        }
        if (typeof bid.buyer_id !== 'string' || bid.buyer_id.trim() === '') {
            return 'Buyer ID must be a non-empty string.';
        }
        if (isNaN(bid.bid_amount) || bid.bid_amount <= 0) {
            return 'Bid Amount must be a positive number.';
        }
        return null;
    };
    const fetchProduce = () => {
        axios.get('http://127.0.0.1:5000/buyer/produce')
            .then(response => {
                setProduceList(response.data); // Update the produce list state
            })
            .catch(err => {
                console.error("Error fetching produce:", err);
                alert("Error fetching produce!");
            });
    };
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user session
        navigate('/'); // Navigate back to the landing page
    };

    // Register the buyer
    // const handleRegister = () => {
    //     axios.post('http://127.0.0.1:5000/buyer/register', form)
    //         .then(response => alert(response.data.message))
    //         .catch(err => console.error(err));
    // };
    const handleRegister = () => {


        axios.post('http://127.0.0.1:5000/buyer/register', form)
            .then(response => alert(response.data.message))
            .catch(err => console.error(err));
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
    };

    // const handlePlaceBid = () => {
    //     axios.post('http://127.0.0.1:5000/buyer/place-bid', bid)
    //         .then(response => {
    //             alert(response.data.message);
    //             // Assuming the response contains the bid data, you can add it to the bid list
    //             setBidList([...bidList, bid]); // Add new bid to the bidList
    //         })
    //         .catch(err => {
    //             console.error('Error placing bid:', err);
    //             alert('Failed to place bid: ' + (err.response?.data?.error || 'Unknown error'));
    //         });
    // };
    const handlePlaceBid = () => {
        const validationError = validateBid();
        if (validationError) {
            setError(validationError);
            return;
        }

        axios.post('http://127.0.0.1:5000/buyer/place-bid', bid)
            .then(response => {
                alert(response.data.message);
                setBidList([...bidList, bid]); // Add new bid to the bidList
            })
            .catch(err => console.error(err));
    };


    // Fetch produce when the component mounts
    useEffect(() => {
        fetchProduce();
    }, []);

    return (
        <div className="buyer-page">
            <h2>Buyer Dashboard</h2>
            <div className="logout-button-container">
                <button onClick={handleLogout} className="btn secondary">Logout</button>
            </div>
            {/* Display Validation Error */}
            {error && <div className="message error">{error}</div>}
            {/* Register Section */}
            <div className="form-section">
                <h3>Register</h3>
                <div className="form-input">
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="contact_info"
                        value={form.contact_info}
                        onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="location"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                </div>
                <button className="btn primary" onClick={handleRegister}>Register</button>
            </div>

            {/* View Produce Section */}
            <div className="produce-section">
                <h3>View Produce</h3>
                <ul className="produce-list">
                    {produceList.length > 0 ? (
                        produceList.map((produce, index) => (
                            <li key={index} className="produce-item">
                                <p><strong>Produce ID:</strong> {produce.produce_id}</p>
                                <p><strong>Name:</strong> {produce.name}</p>
                                <p><strong>Quantity:</strong> {produce.quantity}</p>
                            </li>
                        ))
                    ) : (
                        <p>No produce available.</p>
                    )}
                </ul>
            </div>

            {/* Place Bid Section */}
            <div className="form-section">
                <h3>Place Bid</h3>
                <div className="form-input">
                    <input
                        placeholder="Produce ID"
                        value={bid.produce_id}
                        onChange={(e) => setBid({ ...bid, produce_id: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Buyer ID"
                        value={bid.buyer_id}
                        onChange={(e) => setBid({ ...bid, buyer_id: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Bid Amount"
                        value={bid.bid_amount}
                        onChange={(e) => setBid({ ...bid, bid_amount: e.target.value })}
                    />
                </div>
                <button className="btn secondary" onClick={handlePlaceBid}>Place Bid</button>
            </div>
        </div>
    );
};

export default BuyerPage;
