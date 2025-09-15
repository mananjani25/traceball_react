import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import logo from "./../images/TraceabHALL.png";
import user_image from "./../images/account_icon.png";
import user_profile from "./../images/default-profile.png";
import $ from "jquery";
import "jquery-validation";
import toastr from "toastr";
import Cookies from 'js-cookie';
import { Header } from "./../components/Header";

export const EditEmployeePage = ({ onPageChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("documents");
    const [employeeData, setEmployeeData] = useState({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        ssn: "",
        streetAddress: "",
        city: "",
        state: "",
        zip: "",
        dob: "",
        phone: "",
        email: "",
    });

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const [documentData, setDocumentData] = useState({
        document_type_1: "",
        docuement_number_1: "",
        document_expiration_date_1: "",
        document_type_2: "",
        docuement_number_2: "",
        document_expiration_date_2: "",
    });

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [signatureData, setSignatureData] = useState('');

    const [userProfile, setUserProfile] = useState(user_profile);
    const [editMode, setEditMode] = useState(false);

    const [doc_file_1, setFile1] = useState(null);
    const [doc_file_2, setFile2] = useState(null);

    const handleDocFileChange = (event, setFile) => {
        const file = event.target.files[0];
        setFile(file || null);
    };

    const handleDocRemoveFile = (setFile) => {
        setFile(null);
    };

    const renderFileIcon = (file, setFile) => {
        if (file) {
            const displayName = file.name.length > 7
                ? `${file.name.substring(0, 7)}...`
                : file.name;

            return (
                <>
                    <span className="file-name" title={file.name}>{displayName}</span>
                    <i className="bi bi-x remove-btn" onClick={() => handleDocRemoveFile(setFile)}></i>
                </>
            );
        }
        return <i className="bi bi-camera"></i>;
    };

    const handleDocInputChange = (e) => {
        const { name, value } = e.target;
        setDocumentData({ ...documentData, [name]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserProfile(e.target.result);
                setEditMode(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        if (editMode) {
            setUserProfile(user_profile);
            setEditMode(false);
        } else {
            document.getElementById('profileImageInput').click();
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if ($("#employeeForm").valid()) {
            console.log("Form is valid, submit the data", employeeData);
        } else {
            console.log("Form is invalid");
        }
        // axios
        //   .post("/addEmployee", employeeData)
        //   .then((response) => {
        //     console.log("Employee added successfully:", response.data);
        //   })
        //   .catch((error) => {
        //     console.error("Error adding employee:", error);
        //   });
    };

    const handleDocFormSubmit = (e) => {
        e.preventDefault();

        // Helper function to get a cookie by name
        const getCookie = (name) => {
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
                const [key, value] = cookie.split("=");
                if (key === name) {
                    return value;
                }
            }
            return null;
        };

        // Get unique_id from cookie
        const employee_id = getCookie("employee_id");

        if (!employee_id) {
            console.log("employee_id cookie not found");
            return;
        }

        // Construct the localStorage key
        const localStorageKey = localStorage.getItem(`new-data-${employee_id}`)
            ? `new-data-${employee_id}`
            : `old-data-${employee_id}`;

        // Retrieve existing data from localStorage
        const storedData = localStorage.getItem(localStorageKey);
        let updatedData = {};

        if (storedData) {
            // Parse existing data
            const parsedData = JSON.parse(storedData);
            console.log("Existing data found in localStorage:", parsedData);

            // Merge new data with existing data
            updatedData = {
                ...parsedData,
                current_state: 'documents', // Add current_state parameter
                document_data: [documentData]
            };
        } else {
            console.log("No existing data found in localStorage. Creating new entry.");
            // Initialize new data if no previous data exists
            updatedData = {
                current_state: 'documents', // Add current_state parameter
                document_data: [employeeData]
            };
        }

        // Save the updated data back to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        console.log("Updated data saved to localStorage:", updatedData);

        if ($("#documentForm").valid()) {
            console.log("Form is valid, submit the data", updatedData);
            onPageChange("list-page");
        } else {
            console.log("Form is invalid");
        }

        // Uncomment if making an API call
        // axios
        //   .post("/addEmployee", updatedData)
        //   .then((response) => {
        //     console.log("Employee added successfully:", response.data);
        //   })
        //   .catch((error) => {
        //     console.error("Error adding employee:", error);
        //   });
    };

    const startDrawing = (e) => {
        if (isEditing) {
            setIsDrawing(true);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
        }
    };

    const draw = (e) => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.lineTo(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isEditing) {
            setIsDrawing(false);
        }
    };

    const enableEditing = () => {
        setIsEditing(true);
        const canvas = canvasRef.current;
        canvas.style.pointerEvents = 'auto';
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        const signature = canvas.toDataURL();
        setSignatureData(signature);
        setIsEditing(false);
        canvas.style.pointerEvents = 'none';
    };

    useEffect(() => {

        setActiveTab("documents");

        $('#profileEditIcon').css('display', 'none');
        $('.edit-icon').css('display', 'none');
        $('#employeeTitle').attr('disabled', true);
        // Add custom validation methods
        $.validator.addMethod(
            "alphanumeric",
            function (value, element) {
                return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
            },
            "Only letters and numbers are allowed."
        );

        $.validator.addMethod(
            "ssnFormat",
            function (value, element) {
                return this.optional(element) || /^[0-9]{3} - [0-9]{2} - [0-9]{4}$/.test(value);
            },
            "Please enter a valid Social Security Number in the format xxx - xx - xxxx."
        );

        // Initialize validation
        $("#employeeForm").validate({
            rules: {
                title: {
                    required: true
                },
                first_name: {
                    required: true,
                    alphanumeric: true
                },
                middle_name: {
                    required: true,
                    alphanumeric: true
                },
                last_name: {
                    required: true,
                    alphanumeric: true,
                },
                ssn: {
                    required: true,
                    ssnFormat: true
                },
                street_address: {
                    required: true
                },
                city: {
                    required: true
                },
                state: {
                    required: true
                },
                zip: {
                    required: true,
                    digits: true,
                    minlength: 5,
                    maxlength: 5
                },
                dob: {
                    required: true,
                },
                phone: {
                    required: true,
                    digits: true,
                    maxlength: 10,
                    minlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                profile_image: {
                    required: true,
                },
                signature: {
                    required: true,
                }
            },
            messages: {
                title: {
                    required: "Please select a title"
                },
                first_name: {
                    required: "Please enter your first name",
                    alphanumeric: "First name can only contain letters and numbers"
                },
                middle_name: {
                    required: "Please enter your middle name",
                    alphanumeric: "Middle name can only contain letters and numbers"
                },
                last_name: {
                    required: "Please enter your last name",
                    alphanumeric: "Last name can only contain letters and numbers"
                },
                ssn: {
                    required: "Social Security Number is required.",
                    ssnFormat: "Please enter a valid Social Security Number in the format xxx - xx - xxxx.",
                },
                street_address: {
                    required: "Please enter your street address"
                },
                city: {
                    required: "Please enter your city"
                },
                state: {
                    required: "Please enter your state"
                },
                zip: {
                    required: "Please enter your zip code",
                    digits: "Zip code can only contain numbers",
                    minlength: "Zip code must be 5 digits",
                    maxlength: "Zip code must be 5 digits"
                },
                dob: {
                    required: "Please select your date of birth"
                },
                phone: {
                    required: "Please enter your phone number",
                    digits: "Phone number can only contain numbers",
                    maxlength: "Phone number must be 10 digits",
                    minlength: "Phone number must be 10 digits"
                },
                email: {
                    required: "Please enter your email address",
                    email: "Please enter a valid email address"
                },
                profile_image: {
                    required: "Please upload your profile image",
                },
                signature: {
                    required: "Please upload your signature",
                }
            },
            errorElement: "span",
            errorClass: "error text-danger",
            errorPlacement: function (error, element) {
                if (element.attr("name") == "ssn") {
                    error.appendTo("#ssn_error");
                } else if (element.attr("name") == "street_address") {
                    error.appendTo("#street_address_error");
                } else if (element.attr("name") == "dob") {
                    error.appendTo("#dob_error");
                } else if (element.attr("name") == "profile_image") {
                    error.appendTo("#profile_image_error");
                } else if (element.attr("name") == "signature") {
                    error.appendTo("#signature_error");
                } else {
                    error.insertAfter(element);
                }
            },
        });

        $('#documentForm').validate({
            rules: {
                "document_type_1": {
                    required: true
                },
                "document_number_1": {
                    required: true,
                },
                "expire_date_1": {
                    required: true,
                    date: true
                },
                "document_type_2": {
                    required: true
                },
                "document_number_2": {
                    required: true,
                },
                "expire_date_2": {
                    required: true,
                    date: true
                },
            },
            messages: {
                "document_type_1": "Please select a document type.",
                "document_number_1": "Please enter a document number.",
                "expire_date_1": "Please provide a expiration date.",
                "document_type_2": "Please select a document type.",
                "document_number_2": "Please enter a document number.",
                "expire_date_2": "Please provide a valid expiration date.",
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            errorElement: "span",
            errorClass: "error text-danger"
        });

        // Add SSN formatting logic
        const ssnInput = document.getElementById("ssn");

        const formatSSN = (event) => {
            let value = ssnInput.value.replace(/\D/g, ""); // Remove non-numeric characters
            if (value.length > 9) value = value.slice(0, 9); // Limit to 9 digits

            // Format as xxx - xx - xxxx
            const formattedValue = value.replace(
                /(\d{3})(\d{2})?(\d{4})?/,
                (match, p1, p2, p3) => {
                    let result = p1;
                    if (p2) result += " - " + p2;
                    if (p3) result += " - " + p3;
                    return result;
                }
            );

            ssnInput.value = formattedValue;
            setEmployeeData((prevData) => ({ ...prevData, ssn: formattedValue }));
        };

        ssnInput.addEventListener("input", formatSSN);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            ssnInput.removeEventListener("input", formatSSN);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    const handleOffline = () => {
        console.log('You are now offline.');
        toastr.warning('You are now offline. Data will be saved locally.');
    };

    const handleOnline = () => {
        console.log('You are back online.');
        toastr.info('You are back online. Syncing data to the server.');
        const storedData = localStorage.getItem('offlineEmployeeData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            parsedData.forEach((data) => {
                sendDataToServer(data);
            });
            localStorage.removeItem('offlineEmployeeData');
        }
    };

    const sendDataToServer = async (data) => {
        try {
            const response = await axios.post('/add-employee', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'true') {
                toastr.success('Employee data saved successfully!');
                localStorage.removeItem('offlineEmployeeData');
            } else {
                toastr.error('Failed to save data on the server.');
            }
        } catch (error) {
            toastr.error('Network error. Could not send data.');
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
            <Header onPageChange={onPageChange}/>

            <h1 className="account_heading">Employee Details</h1>
            <div className="form-wrapper">
                <div className="left-section">
                    <p className="title">Add Photograph</p>
                    <div className="profile-picture">
                        <img id="photoPreview" src={userProfile} alt="Profile" />
                        <span
                            className="Profile-edit-icon"
                            id="profileEditIcon"
                            onClick={handleEditClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className={`bi ${editMode ? 'bi-trash' : 'bi-pencil'}`}></i>
                        </span>
                        <span id="profile_picture_error" className="error"></span>
                    </div>
                    <p className="title">Title</p>
                    <div className="dropdown-container">
                        <select
                            className="custom-dropdown"
                            id="employeeTitle"
                            name="title"
                            value={employeeData.title}
                            onChange={handleInputChange}
                        >
                            <option value="">Select an title</option>
                            <option value="grower">Grower</option>
                            <option value="ranch">Ranch</option>
                        </select>
                        <span id="title_error" className="error"></span>
                    </div>
                    <div className="signature" style={{ position: 'relative' }}>
                        <label className="Add_photo">Add Photograph</label>
                        <canvas
                            id="signatureCanvas"
                            ref={canvasRef}
                            width="351"
                            height="47"
                            style={{ border: '1px solid #ccc' }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                        ></canvas>
                        <span
                            className="edit-icon"
                            style={{ position: 'absolute', top: '13px', right: '43px', backgroundColor: 'white', borderRadius: '50%', cursor: 'pointer' }}
                        >
                            {!isEditing ? (
                                <i
                                    className="bi bi-pencil edit"
                                    style={{ fontSize: '18px' }}
                                    onClick={enableEditing}
                                ></i>
                            ) : (
                                <i
                                    className="bi bi-trash clear"
                                    style={{ fontSize: '18px', display: 'inline-block' }}
                                    onClick={clearCanvas}
                                ></i>
                            )}
                        </span>
                        <br />
                        <span id="signature_error" className="error"></span>
                    </div>
                </div>
                <div className="right-section">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === "personal" ? "active" : ""}`}
                            onClick={() => setActiveTab("personal")} disabled
                        >
                            Personal and Contact Data
                        </button>
                        <button
                            className={`tab ${activeTab === "documents" ? "active" : ""}`}
                            onClick={() => setActiveTab("documents")}
                        >
                            Documents
                        </button>
                    </div>
                    <div
                        className={`tab-content ${activeTab === "personal" ? "active" : "hidden"}`}
                        id="personal"
                    >
                        <form id="employeeForm" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                            <input
                                type="file"
                                id="profileImageInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                name="profile_image"
                                onChange={handleFileChange}
                            />
                            <input type="hidden" id="signatureInput" value={signatureData} />
                            <input type="hidden" id="title" name="employee_title" />
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="John" className="Name-feild" name="first_name" value={employeeData.first_name} onChange={handleInputChange} />
                                <span id="name_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group">
                                <label>Middle Name</label>
                                <input type="text" placeholder="Middle Name" className="Name-feild" name="middle_name" value={employeeData.middle_name} onChange={handleInputChange} />
                                <span id="middle_name_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" placeholder="Micheal" className="Name-feild" name="last_name" value={employeeData.last_name} onChange={handleInputChange} />
                                <span id="last_name_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group full-width">
                                <label>Social Security Number (xxx - xx - xxxx)</label>
                                <input type="text" placeholder="Social Security Number" className="security_number" name="ssn" id="ssn" value={employeeData.ssn} onChange={handleInputChange} />
                                <br /><span className="error" id="ssn_error"></span>
                            </div>
                            <h3 className="phy-addres">Physical Address</h3>
                            <div className="form-group full-width">
                                <label>Street Address</label>
                                <input type="text" placeholder="Street Address" className="Name-feild"
                                    name="street_address" value={employeeData.street_address} onChange={handleInputChange} />
                                <br /><span className="error" id="street_address_error"></span>
                            </div>
                            <div className="form-group">
                                <label>City or Town</label>
                                <input type="text" placeholder="City or Town" className="add-feild" name="city" value={employeeData.city} onChange={handleInputChange} />
                                <span id="city_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" placeholder="State" className="add-feild" name="state" value={employeeData.state} onChange={handleInputChange} />
                                <span id="state_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group">
                                <label>ZIP Code (5 digits)</label>
                                <input type="text" placeholder="ZIP Code" className="add-feild" name="zip" value={employeeData.zip} onChange={handleInputChange} />
                                <span id="zip_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group full-width">
                                <label>Date of Birth</label>
                                <input type="date" placeholder="MM/DD/YY" className="date-feild" name="dob" value={employeeData.dob} onChange={handleInputChange} />
                                <span className="error" id="dob_error"></span>
                            </div>
                            <div className="form-group half-width">
                                <label>Telephone Number</label>
                                <input type="text" placeholder="Telephone Number" className="tel-number" name="phone" value={employeeData.phone} onChange={handleInputChange} />
                                <span id="phone_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <div className="form-group half-width">
                                <label>Email Address</label>
                                <input type="text" placeholder="Email Address" className="tel-number" name="email" value={employeeData.email} onChange={handleInputChange} />
                                <span id="email_error" style={{ color: 'red' }} className="error"></span>
                            </div>
                            <button type="submit" id="saveForm" className="save-btn">Save & Next</button>
                        </form>
                    </div>
                    <div
                        className={`tab-content ${activeTab === "documents" ? "active" : "hidden"}`}
                        id="documents"
                    >
                        <form id="documentForm" encType="multipart/form-data" onSubmit={handleDocFormSubmit}>
                            <input type="hidden" name="employee_id" id="employee_id" />
                            <div className="document-section">
                                <div className="Document-form-group">
                                    <label htmlFor="document-title-1">Document Title</label>
                                    <select id="document-title-1" className="document-Selector" name="document_type_1" onChange={handleDocInputChange} value={documentData.document_title_1}>
                                        <option value="">Upload Document</option>
                                        <option value="document 1">Document 1</option>
                                        <option value="document 2">Document 2</option>
                                    </select>
                                    <span id="document-title-1-error" className="error"></span>
                                    <div className="document-section">
                                        <div className="Document-form-group">
                                            <input type="text" id="document-number-1" placeholder="Document Number" className="Document-number" name="document_number_1" onChange={handleDocInputChange} value={documentData.document_number_1} />
                                            <span id="document-number-1-error" className="error"></span>
                                        </div>
                                        <div className="Document-form-group">
                                            <input type="date" id="expiration-date-1" className="expire_date" name="expire_date_1" onChange={handleDocInputChange} value={documentData.expire_date_1} />
                                            <span id="expiration-date-1-error" className="error"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="upload-container">
                                    <input type="file" id="upload-file-1" name="upload-file-1" accept="image/*,application/pdf" onChange={(event) => handleDocFileChange(event, setFile1)} style={{ display: 'none' }} />
                                    <span className="file-icon">
                                        {renderFileIcon(doc_file_1, setFile1)}
                                    </span>
                                    <label
                                        htmlFor="upload-file-1"
                                        style={{ display: doc_file_1 ? 'none' : 'inline-block' }}
                                    >
                                        Upload File
                                    </label>
                                    <span id="upload-file-1-error" className="error"></span>
                                </div>
                            </div>

                            <div className="document-section">
                                <div className="Document-form-group">
                                    <label htmlFor="document-title-2">Document Title</label>
                                    <select id="document-title-2" className="document-Selector" name="document_type_2" onChange={handleDocInputChange} value={documentData.document_title_2}>
                                        <option value="">Upload Document</option>
                                        <option value="document 1">Document 1</option>
                                        <option value="document 2">Document 2</option>
                                    </select>
                                    <span id="document-title-2-error" className="error"></span>
                                    <div className="document-section">
                                        <div className="Document-form-group">
                                            <input type="text" id="document-number-2" placeholder="Document Number" className="Document-number" name="document_number_2" onChange={handleDocInputChange} value={documentData.document_number_2} />
                                            <span id="document-number-2-error" className="error"></span>
                                        </div>
                                        <div className="Document-form-group">
                                            <input type="date" id="expiration-date-2" className="expire_date" placeholder="Expiration Date" name="expire_date_2" onChange={handleDocInputChange} value={documentData.expire_date_2} />
                                            <span id="expiration-date-2-error" className="error"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="upload-container">
                                    <input type="file" id="upload-file-2" name="upload-file-2" accept="image/*,application/pdf" onChange={(event) => handleDocFileChange(event, setFile2)} style={{ display: 'none' }} />
                                    <span className="file-icon">
                                        {renderFileIcon(doc_file_2, setFile2)}
                                    </span>
                                    <label
                                        htmlFor="upload-file-2"
                                        style={{ display: doc_file_2 ? 'none' : 'inline-block' }}
                                    >
                                        Upload File
                                    </label>
                                    <span id="upload-file-2-error" className="error"></span>
                                </div>
                            </div>
                            <button type="submit" id="saveDocumentForm" className="save-btn">Save & Next</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
