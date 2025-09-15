import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './../images/TraceabHALL.png';
import user_image from './../images/default-profile.png';
import Cookies from 'js-cookie';
import { Header } from "./../components/Header";

export const ListPage = ({ onPageChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [formStates, setFormStates] = useState({
        de4State: 'Incomplete',
        w4State: 'Completed'
    });

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    useEffect(() => {
        // Check if employee_id exists in the cookie
        const employee_id = document.cookie.split(';').find(cookie => cookie.trim().startsWith('employee_id='));

        if (employee_id) {
            // Get the value of employee_id from the cookie
            const cookieValue = employee_id.split('=')[1];

            // Check if the corresponding value exists in localStorage
            const localStorageKey = localStorage.getItem(`new-data-${cookieValue}`)
                ? `new-data-${cookieValue}`
                : `old-data-${cookieValue}`;
            const localStorageValue = localStorage.getItem(localStorageKey);

            if (localStorageValue) {
                // If the value exists, get the current state from the URL or some parameter
                const data = JSON.parse(localStorageValue);
                const currentState = data.current_state;

                console.log("currentState");
                console.log(currentState);

                // Set form states based on the currentState
                if (currentState === 'de-4-form') {
                    setFormStates({
                        de4State: 'Completed',
                        w4State: 'Incomplete'
                    });
                } else if (currentState === 'w-4-form') {
                    setFormStates({
                        de4State: 'Completed',
                        w4State: 'Completed'
                    });
                } else {
                    setFormStates({
                        de4State: 'Incomplete',
                        w4State: 'Incomplete'
                    });
                }
            }
        }
    }, []);

    const userProfileStyle = {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    };

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

    const dropdownMenuStyle = {
        padding: '10px',
        textAlign: 'center',
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

    const handleLogout = () => {
        Cookies.remove('token');
        onPageChange('login');
        window.location.reload();
    };

    return (
        <div className="dashboard_container">
            <Header onPageChange={onPageChange} />

            <h2 className="Form_heading">Forms</h2>
            <table>
                <thead>
                    <tr>
                        <th className="forms_head">Form Name</th>
                        <th className="forms_head">Progress</th>
                        <th className="forms_head"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="Form_name">DE-4 English</td>
                        <td><span className={`badge ${formStates.de4State.toLowerCase()}`}>{formStates.de4State}</span></td>
                        <td>
                            <button className="edit-btn" onClick={() => onPageChange('de-4-form')}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="Form_name">W-4 English</td>
                        <td><span className={`badge ${formStates.w4State.toLowerCase()}`}>{formStates.w4State}</span></td>
                        <td>
                            <button className="edit-btn" onClick={() => onPageChange('w-4-form')}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
