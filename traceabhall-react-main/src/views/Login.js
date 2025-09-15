import React, { useState } from 'react';
import logo from '../images/TraceabHALL.png';

export const Login = ({ onPageChange }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const companyID = document.getElementById('companyID').value;
        const pinNumber = document.getElementById('pinNumber').value;

        try {
            const response = await fetch('http://16.170.204.11:8001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ companyID, pinNumber }),
            });

            const result = await response.json();

            if (!result.success) {
                setErrorMessage(result.message);
            } else {
                document.cookie = `token=${result.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
                document.cookie = `user_role=${result.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
                document.cookie = `user_id=${result.user_id}; path=/; max-age=${60 * 60 * 24 * 7}`;
                // if (result.role === 'admin') {
                //     window.location.href = '/admin/dashboard';
                // } else {
                    onPageChange('dashboard');
                // }
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <main>
            <div className="main-content">
                <div className="logo">
                    <img className="main-logo" src={logo} alt="Logo" />
                </div>
                <p className="login_text">Employer Login</p>

                <p id="error-message" style={{ color: 'red' }}>{errorMessage}</p>

                <form id="loginForm" className="Login_form" onSubmit={handleLogin}>
                    <label className="login_label" htmlFor="companyID">Company ID</label>
                    <input
                        className="login_input"
                        type="text"
                        id="companyID"
                        name="companyID"
                        placeholder="Enter Company ID"
                        required
                    />

                    <label className="login_label" htmlFor="pinNumber">Pin Number</label>
                    <input
                        className="password_input"
                        type="password"
                        id="pinNumber"
                        name="pinNumber"
                        placeholder="0 0 0 0 0"
                        required
                    />

                    <div className="Reset_password">
                        <p className="checkbox_sec">
                            <input className="checkbox" type="checkbox" name="remember" /> Remember me
                        </p>
                        <p className="forgot_pass"><a href="#">Forgot Pin?</a></p>
                    </div>

                    <button className="login_btn" id="login_btn" type="submit">Log In</button>
                </form>
            </div>
        </main>
    );
};
