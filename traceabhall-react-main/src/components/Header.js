import React, { useState } from "react";
import logo from "./../images/TraceabHALL.png";
import user_image from "./../images/default-profile.png";
import Cookies from 'js-cookie';

export const Header = ({ onPageChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const profileDropdownStyle = {
        position: 'absolute',
        top: '40px',
        right: '0',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        minWidth: '150px',
        zIndex: 10,
    };

    const logoutBtnStyle = {
        backgroundColor: '#ff4d4d',
        border: 'none',
        color: '#fff',
        padding: '8px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
        width: '100%',
    };

    const userProfileStyle = {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const dropdownMenuStyle = {
        padding: '10px',
        textAlign: 'center',
    };

    const handleLogout = () => {
        Cookies.remove('token');
        onPageChange('login');
        window.location.reload();
    };

    return (
        <header className="header">
                <img className="main-logo" src={logo} alt="Logo" onClick={() => onPageChange('dashboard')} style={{cursor: 'pointer'}}/>
                {/* <div className="language-selector">
                    <a href="#" className="Signup_btn">English</a>
                    <a href="#" className="Signup_btn">Spanish</a>
                </div> */}
                <div style={userProfileStyle} className="user-profile">
                    <img
                        src={user_image}
                        alt="User Profile"
                        onClick={toggleDropdown}
                        style={{ cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}
                    />
                    {dropdownVisible && (
                        <div style={profileDropdownStyle} className="dropdown-menu">
                            <div style={dropdownMenuStyle}>
                                <button onClick={handleLogout} style={logoutBtnStyle} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
    );
};