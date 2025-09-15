import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './../images/TraceabHALL.png';
import user_image from './../images/default-profile.png';
import toastr from "toastr";
import Cookies from 'js-cookie';
import $ from "jquery";
import { Header } from "./../components/Header";

export const Dashboard = ({ onPageChange }) => {
    const [onBoardCount, setOnBoardCount] = useState(0);
    const [draftCount, setDraftCount] = useState(0);
    const [completedUsers, setCompletedUsers] = useState([]);
    const [draftUsers, setDraftUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]); // State to store data for table
    const [onlineMessageShown, setOnlineMessageShown] = useState(false);
    const [offlineMessageShown, setOfflineMessageShown] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect( () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(key); // Check each key
            if (key.startsWith("old-data-")) {
                localStorage.removeItem(key);
                console.log(`Removed: ${key}`);
            }
        }        

        fetchAndSyncUserData();

        document.cookie = 'employee_id =; expires = Thu, 01 Jan 1970 00:00:00 GMT';

        const handleOnline = () => {
            $(".resume-btn").show();
            $(".error_line").text('Oops! Data not found.');
            if (!onlineMessageShown) {
                fetchAndSyncUserData(); // Replace with your sync logic
                setOnlineMessageShown(true);
                setOfflineMessageShown(false); // Reset offline flag
            }
        };

        const handleOffline = () => {
            $(".resume-btn").css("display", "none");
            $(".error_line").text('You are offline! Data cannot be displayed at the moment.');
            if (!offlineMessageShown) {
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

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const formatData = (data) => {
        // Format data into a consistent structure
        return data.map((user) => ({
            id: user.id,
            name: user.name,
            current_state: user.current_state,
            // Add more fields as needed for display
        }));
    };

    const fetchAndSyncUserData = async () => {
        try {
            if (!navigator.onLine) {
                // If offline, load data directly from local storage
                console.warn("User is offline. Loading data from local storage.");

                const offlineData = [];
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith("old-data-") || key.startsWith("new-data-")) {
                        const data = JSON.parse(localStorage.getItem(key));
                        console.log("Offline Data:", data);
                        offlineData.push(data); // Only store data (no key info)
                    }
                });

                console.log("Offline Data for Tables:", offlineData);

                // Format offline data to match online format
                const formattedOfflineData = formatData(offlineData);

                // Set the formatted offline data
                setUsers(formattedOfflineData);

                offlineData.forEach((user) => {
                    // Check if the user with the same id already exists in the array
                    const isUserExistsInCompleted = completedUsers.some(existingUser => existingUser.id === user.id);
                    const isUserExistsInDrafts = draftUsers.some(existingUser => existingUser.id === user.id);

                    // If the user doesn't already exist in the completed or draft array, add them
                    if (!isUserExistsInCompleted && !isUserExistsInDrafts) {
                        if (user.current_state === "w-4-form") {
                            completedUsers.push(user);
                        } else {
                            draftUsers.push(user);
                        }
                    }
                });
            } else {
                try {
                    const response = await axios.post(`http://16.170.204.11:8001/employee`, {
                        user_id: document.cookie.split(';').find(cookie => cookie.trim().startsWith('user_id=')).split('=')[1],
                    });
                    console.log("Online Data for Tables:", response.data);
                    const onlineData = response.data;

                    // let completed = [];
                    // let drafts = [];

                    onlineData.forEach((user) => {
                        // Save each user's data to local storage
                        localStorage.setItem(`old-data-${user.id}`, JSON.stringify(user));

                        const isUserExistsInCompleted = completedUsers.some(existingUser => existingUser.id === user.id);
                        const isUserExistsInDrafts = draftUsers.some(existingUser => existingUser.id === user.id);

                        // If the user doesn't already exist in the completed or draft array, add them
                        if (!isUserExistsInCompleted && !isUserExistsInDrafts) {
                            if (user.current_state === "w-4-form") {
                                completedUsers.push(user);
                            } else {
                                draftUsers.push(user);
                            }
                        }
                    });

                    // Format online data to match the table structure
                    const formattedOnlineData = formatData(onlineData);

                    const offlineData = [];
                    Object.keys(localStorage).forEach((key) => {
                        if (key.startsWith("new-data-")) {
                            const data = JSON.parse(localStorage.getItem(key));
                            console.log("Offline Data:", data);
                            offlineData.push(data); // Only store data (no key info)
                        }
                    });

                    console.log("Offline Data for Tables:", offlineData);

                    // Format offline data to match online format
                    const formattedOfflineData = formatData(offlineData);

                    // Set the formatted offline data
                    setUsers(formattedOfflineData);

                    offlineData.forEach((user) => {
                        // Check if the user with the same id already exists in the array
                        const isUserExistsInCompleted = completedUsers.some(existingUser => existingUser.id === user.id);
                        const isUserExistsInDrafts = draftUsers.some(existingUser => existingUser.id === user.id);

                        // If the user doesn't already exist in the completed or draft array, add them
                        if (!isUserExistsInCompleted && !isUserExistsInDrafts) {
                            if (user.current_state === "w-4-form") {
                                completedUsers.push(user);
                            } else {
                                draftUsers.push(user);
                            }
                        }
                    });

                    const newDataKeys = Object.keys(localStorage).filter(
                        (key) => key.startsWith("new-data-") || key.startsWith("profile_picture_")
                    );
                    console.log("New Data Keys:", newDataKeys);
                    if (newDataKeys.length > 0) {
                        const newData = newDataKeys.map((key) => {
                            const value = localStorage.getItem(key);
                            try {
                                // Try parsing the value as JSON
                                return JSON.parse(value);
                            } catch (error) {
                                // If parsing fails, return the raw string
                                console.warn(`Invalid JSON for key ${key}. Adding as string.`);
                                return value;
                            }
                        });
                        console.log("New Data:", newData);
                        const syncResponse = await axios.post(" http://localhost:8001/sync-data", {
                            action: "sync",
                            data: newData,
                        });

                        if (syncResponse.status == 200) {
                            newDataKeys.forEach((key) => localStorage.removeItem(key));
                            console.log("Successfully synced and removed new data:", newData);
                        }
                    }

                    setUsers(formattedOnlineData);
                    setOnBoardCount(completedUsers.length);
                    setDraftCount(draftUsers.length);
                } catch (syncError) {
                    console.error("Error syncing new data:", syncError);
                    console.warn("Unsynced data remains in local storage.");
                }

                // Handle syncing of new data
                // const newDataKeys = Object.keys(localStorage).filter(
                //     (key) => key.startsWith("old-data-") || key.startsWith("new-data-")
                // );
                // if (newDataKeys.length > 0) {
                //   const newData = newDataKeys.map((key) => JSON.parse(localStorage.getItem(key)));

                //   newData.forEach((user) => {
                //     const isUserExistsInCompleted = completedUsers.some(existingUser => existingUser.id === user.id);
                //     const isUserExistsInDrafts = draftUsers.some(existingUser => existingUser.id === user.id);

                //     // If the user doesn't already exist in the completed or draft array, add them
                //     if (!isUserExistsInCompleted && !isUserExistsInDrafts) {
                //       if (user.current_state === "w-4-form") {
                //         completedUsers.push(user);
                //       } else {
                //         draftUsers.push(user);
                //       }
                //     }
                //   })
                // }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            console.warn("Local storage data remains intact.");
        }
    };



    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredCompletedUsers = completedUsers.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
    );

    const filteredDraftUsers = draftUsers.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
    );

    const handleResume = async (id) => {
        document.cookie = `employee_id=${id}; path=/; max-age=${7 * 24 * 60 * 60}`;

        try {
            const employeeDataKey = localStorage.getItem(`new-data-${id}`)
                ? `new-data-${id}`
                : `old-data-${id}`;;
            const localStorageData = localStorage.getItem(employeeDataKey);

            if (localStorageData) {
                const data = JSON.parse(localStorageData);
                const currentState = data.current_state;

                console.log("currentState");
                console.log(currentState);

                // Navigate based on the current state
                if (currentState == "persnal-data") {
                    // Send type as 'edit-profile' to change page
                    onPageChange('edit-profile');
                } else {
                    // Send type as 'list-page' to change page
                    onPageChange('list-page');
                }
            } else {
                console.warn(`No localStorage data found for employee_id: ${id}`);
                onPageChange('list-page'); // Default to 'list-page' if no data exists
            }
        } catch (error) {
            console.error("Error resuming employee:", error);
        }
    };

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
            <Header onPageChange={onPageChange} ></Header>
            <div className="search-bar">
                <button className="add-employee-btn" onClick={() => onPageChange('add-employee')}>
                    + Add Employee
                </button>
                <input
                    type="text"
                    placeholder="Search by keyword"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <section className="section">
                <div className="Onboarding">
                    <h2>
                        Completed Onboarding (<span>{onBoardCount}</span>)
                    </h2>
                    <div className="onBoardCountPagination">
                        1-<span>{onBoardCount}</span>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Joining Date</th>
                            <th>Located In</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompletedUsers.length > 0 ? (
                            filteredCompletedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{`${user.first_name} ${user.last_name}`}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {`${user.street_address}, ${user.city}, ${user.state}, ${user.zip_code}`}
                                    </td>
                                    <td>
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="error_line" style={{ textAlign: "center", color: "red" }}>
                                    Oops! Data not found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            <br />

            <section className="section">
                <div className="Onboarding">
                    <h2>
                        Draft Profile (<span>{draftCount}</span>)
                    </h2>
                    <div className="draftCountPagination">
                        1-<span>{draftCount}</span>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last Edited</th>
                            <th>Completed</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDraftUsers.length > 0 ? (
                            filteredDraftUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{`${user.first_name} ${user.last_name}`}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {user.current_state === "persnal-data"
                                            ? "25%"
                                            : user.current_state === "de-4-form"
                                                ? "75%"
                                                : user.current_state === "documents"
                                                    ? "50%"
                                                    : "0%"}
                                    </td>
                                    <td className="action-buttons">
                                        <button className="resume-btn" onClick={() => handleResume(user.id)}>
                                            Resume
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="error_line" style={{ textAlign: "center", color: "red" }}>
                                    Oops! Data not found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};
