import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FarmerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    // Hardcoded credentials for demonstration
    const hardcodedEmail = 'abc@gmail.com';
    const hardcodedPassword = '123456';

    const handleLogin = () => {
        if (email === hardcodedEmail && password === hardcodedPassword) {
            setSuccessMessage('Logged in successfully!');
            setError(null);
            // Simulate storing u\ser session
            localStorage.setItem('user', JSON.stringify({ email }));
            navigate('/farmer');
        } else {
            setError('Invalid email or password.');
            setSuccessMessage(null);
        }
    };
    //     return (
    //         <div className="login-page">
    //             <h2>Farmer Login</h2>
    //             {successMessage && <div className="message success">{successMessage}</div>}
    //             {error && <div className="message error">{error}</div>}
    //             <div className="form-section">
    //                 <div className="form-input">
    //                     <input
    //                         type="email"
    //                         placeholder="Email"
    //                         value={email}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                     />
    //                 </div>
    //                 <div className="form-input">
    //                     <input
    //                         type="password"
    //                         placeholder="Password"
    //                         value={password}
    //                         onChange={(e) => setPassword(e.target.value)}
    //                     />
    //                 </div>
    //                 <button className="btn primary" onClick={handleLogin}>Login</button>
    //             </div>
    //         </div>
    //     );
    // };
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2D5A27, #52A447, #86C67C)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                width: '380px',
                padding: '40px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px 0 rgba(45, 90, 39, 0.37)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    color: '#2D5A27',
                    marginBottom: '30px',
                    fontSize: '28px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>Farmer Login</h2>

                {successMessage && <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(82, 164, 71, 0.1)',
                    color: '#2D5A27',
                    borderRadius: '10px',
                    border: '1px solid #52A447'
                }}>{successMessage}</div>}

                {error && <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    color: '#f44336',
                    borderRadius: '10px',
                    border: '1px solid #f44336'
                }}>{error}</div>}

                <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.border = '2px solid #52A447'}
                        onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
                    />
                </div>

                <div style={{ marginBottom: '30px', position: 'relative' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.border = '2px solid #52A447'}
                        onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: 'linear-gradient(45deg, #2D5A27, #52A447)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 15px rgba(45, 90, 39, 0.3)'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(45, 90, 39, 0.4)';
                        e.target.style.background = 'linear-gradient(45deg, #52A447, #86C67C)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(45, 90, 39, 0.3)';
                        e.target.style.background = 'linear-gradient(45deg, #2D5A27, #52A447)';
                    }}
                >
                    Login
                </button>

                <div style={{
                    marginTop: '20px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    {/* <a href="#" style={{
                        color: '#2D5A27',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>Forgot Password?</a> */}
                </div>
            </div>
        </div>
    );
};


export default FarmerLogin;