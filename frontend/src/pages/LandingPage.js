import React from 'react';
import Card from '../components/Card';
import Hero from '../components/Hero';
import { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './landingpage.css';
const LandingPage = () => {
    // const notify = () => toast("Welcome to our platform!");

    // React.useEffect(() => {
    //     notify();
    // }, []);
    const [commodityPrices, setCommodityPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 579b464db66ec23bdd00000197b6b333c6944f025790973d6115fce7
    // useEffect(() => {
    //     const fetchCommodityPrices = async () => {
    //         try {
    //             const response = await fetch('/api/explore/v2.1/catalog/datasets/commodity-prices/records?limit=20')


    //             const text = await response.text(); // Get the response as text
    //             console.log('Response:', text); // Log the response

    //             if (!response.ok) {
    //                 throw new Error(`Network response was not ok: ${text}`);
    //             }

    //             const data = JSON.parse(text); // Parse the text as JSON
    //             setCommodityPrices(data.prices); // Adjust based on the API response structure
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //             setError(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchCommodityPrices();
    // }, []);

    return (
        <div>
            <a
                href="https://agmarknet.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-button"
            >
                Commodity Price
            </a>

            <Hero />
            <div className="cards">
                <Card
                    title="Real-Time Bidding"
                    description="Farmers and buyers can engage in a transparent bidding system where farmers list their produce, and buyers compete, ensuring fair pricing and eliminating middlemen. This fosters trust, provides real-time market updates, and ensures farmers get the best value while buyers secure quality produce at competitive rates."
                    imageUrl="real-time-bidding.png"
                />

                {/* <Card
                    title="Demand Forecasting and Market Insights"
                    description="Advanced analytics provide accurate demand forecasts and market trends, helping farmers optimize production and buyers make informed purchasing decisions."
                    imageUrl="demand-forecasting-feature-image.webp"

                /> */}
                <a
                    href="https://cropseer.streamlit.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                    style={{ textDecoration: 'none' }}
                >
                    <img
                        src="demand-forecasting-feature-image.webp"
                        alt="Demand Forecasting and Market Insights"
                    />
                    <h3>Demand Forecasting and Market Insights</h3>
                    <p>Advanced analytics provide accurate demand forecasts and market trends, helping farmers optimize production and buyers make informed purchasing decisions.</p>
                </a>


                <Card
                    title="Integrated Logistics Solutions"
                    description="eMandi connects logistics providers with farmers and buyers, ensuring cost-effective and timely delivery while minimizing transportation delays and costs."
                    imageUrl="logistics.jpg"
                />
                {/* <div className="commodity-prices">
                    {loading && <p>Loading prices...</p>}
                    {error && <p>Error fetching prices: {error}</p>}
                    {!loading && !error && (
                        <ul>
                            {commodityPrices.map((price, index) => (
                                <li key={index}>{price.name}: ${price.value}</li> // Adjust based on the API response structure
                            ))}
                        </ul>
                    )}
                </div> */}

            </div>
            {/* <ToastContainer /> */}
            <div className="login-icons-container">
                <Link to="/farmer/login" className="login-icon">
                    <i className="fas fa-user-farmer"></i> {/* Farmer Icon */}
                </Link>
                <Link to="/buyer/login" className="login-icon">
                    <i className="fas fa-user"></i> {/* Buyer Icon */}
                </Link>
                <Link to="/logistics/login" className="login-icon">
                    <i className="fas fa-truck"></i> {/* Logistics Icon */}
                </Link>
            </div>
            <div className="commodity-prices">
                {loading && <p>Loading prices...</p>}
                {error && <p>Error fetching prices: {error}</p>}
                {!loading && !error && (
                    <ul>
                        {commodityPrices.map((price, index) => (
                            <li key={index}>{price.name}: ${price.value}</li> // Adjust based on the API response structure
                        ))}
                    </ul>
                )}
            </div>
            <footer className="footer">
                <p><strong>Currently under development.</strong> Thank you for your patience!</p>
            </footer>
        </div>
    );
};

export default LandingPage;
