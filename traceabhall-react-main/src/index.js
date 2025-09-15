import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dashboard } from './views/Dashboard';
import { EditEmployeePage } from './views/EditEmployeePage';
import { ListPage } from './views/ListPage';
import { AddEmployeePage } from './views/AddEmployeePage';
import { DE4Form } from './views/DE4Form';
import { W4Form } from './views/W4Form';
// import { registerServiceWorker } from './serviceWorkerRegistration';
import { Login } from './views/Login';
import toastr from "toastr";


const App = () => {
    const [currentPageType, setCurrentPageType] = useState('dashboard'); // Default page is dashboard
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [data, setData] = useState([]);
    // const [offlineData, setOfflineData] = useState({});
    const [users, setUsers] = useState([{ id: 'default', name: 'Default User' }]);
    const [currentUser, setCurrentUser] = useState('default');
    const [onlineMessageShown, setOnlineMessageShown] = useState(false);
    const [offlineMessageShown, setOfflineMessageShown] = useState(false);

    useEffect(() => {
        const savedToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1]; // Extract the token if it exists
        if (savedToken) {
            setIsAuthenticated(true);
            setCurrentPageType('dashboard');
        }


        const handleOnline = () => {
            if (!onlineMessageShown) {
                console.log("User is online.");
                setTimeout(() => {
                    toastr.success("You are back online. Syncing data to the server.");
                }, 2000); // Replace with your sync logic
                setOnlineMessageShown(true);
                setOfflineMessageShown(false); // Reset offline flag
            }
        };

        const handleOffline = () => {
            if (!offlineMessageShown) {
                console.log("User is offline.");
                setTimeout(() => {
                    toastr.warning("You are now offline. Data will be saved locally.");
                })
                setOfflineMessageShown(true);
                setOnlineMessageShown(false); // Reset online flag
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [onlineMessageShown, offlineMessageShown]);

    const handleLogin = () => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1]; // Extract the token if it exists

        if (token) {
            console.log('Token found:', token);
            setIsAuthenticated(true);
            setCurrentPageType('dashboard'); // Proceed with login
        } else {
            console.log('No token found');
            // Handle the case where there's no token
        }
    };


    const handleTypeChange = (currentPageType) => setCurrentPageType(currentPageType);

    const handleFormSubmit = (formData) => {
        if (navigator.onLine) {
            fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((newData) => setData((prev) => [...prev, newData]))
                .catch((error) => console.error('Error saving data:', error));
        } else {
            const updatedOfflineData = {
                // ...offlineData,
                // [currentUser]: [...(offlineData[currentUser] || []), formData],
            };
            localStorage.setItem('offlineData', JSON.stringify(updatedOfflineData));
            // setOfflineData(updatedOfflineData);
        }
        setCurrentPageType('dashboard');
    };

    const handleLogout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };


    const handlePageChange = (type) => {
        setCurrentPageType(type);
    };


    const renderPage = () => {
        console.log("currentPageType");
        console.log(currentPageType);
        if (!isAuthenticated) {
            return <Login onPageChange={handleLogin} />;
        }
        switch (currentPageType) {
            case 'add-employee':
                return <AddEmployeePage onPageChange={handlePageChange} />;
            case 'de-4-form':
                return <DE4Form onPageChange={handlePageChange} />;
            case 'w-4-form':
                return <W4Form onPageChange={handlePageChange} />;
            case 'edit-profile':
                return <EditEmployeePage onPageChange={handlePageChange} />;
            case 'list-page':
                return <ListPage onPageChange={handlePageChange} />;
            case 'dashboard':
            default:
                return <Dashboard onPageChange={handlePageChange} />;
        }
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);