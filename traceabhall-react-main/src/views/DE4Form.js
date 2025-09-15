import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './../images/TraceabHALL.png';
import user_image from './../images/default-profile.png';
import development_logo from './../images/image 2.png';
import Cookies from 'js-cookie';
import { Header } from "./../components/Header";

export const DE4Form = ({ onPageChange }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
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

    useEffect(() => {
        // Check if cookie 'employee_id' exists
        const employee_id = document.cookie.replace(/(?:(?:^|.*;\s*)employee_id\s*=\s*([^;]*).*$)|^.*$/, "$1");

        if (employee_id) {
            // Check if 'new-data-{cookie value}' exists in localStorage
            const localStorageData = localStorage.getItem(`new-data-${employee_id}`) || localStorage.getItem(`old-data-${employee_id}`);

            if (localStorageData) {
                // Parse the stored data from localStorage and set state
                const data = JSON.parse(localStorageData);
                setEmployeeData({
                    title: data.title || "",
                    firstName: data.first_name || "",
                    middleName: data.middle_name || "",
                    lastName: data.last_name || "",
                    ssn: data.social_security_number || "",
                    streetAddress: data.street_address || "",
                    city: data.city || "",
                    state: data.state || "",
                    zip: data.zip_code || "",
                    dob: data.dob || "",
                    phone: data.phone || "",
                    email: data.email || "",
                });
            }
        }
    }, []);

    const handleSaveAndNext = () => {
        // Retrieve the current employee ID from cookies
        const employee_id = document.cookie.replace(/(?:(?:^|.*;\s*)employee_id\s*=\s*([^;]*).*$)|^.*$/, "$1");

        if (employee_id) {
            // Try to get data from `new-data` first, then `old-data`
            const localStorageKey = localStorage.getItem(`new-data-${employee_id}`)
                ? `new-data-${employee_id}`
                : `old-data-${employee_id}`;

            if (localStorageKey) {
                const localStorageData = localStorage.getItem(localStorageKey);

                if (localStorageData) {
                    // Parse the stored data from localStorage
                    const data = JSON.parse(localStorageData);

                    console.log("data");
                    console.log(data.current_state);

                    // Update the current_state property
                    data.current_state = 'de-4-form';

                    // Save the updated data back to the same key in localStorage
                    localStorage.setItem(localStorageKey, JSON.stringify(data));

                    console.log("updated_data");
                    console.log(data.current_state);

                    // Navigate to the next page
                    onPageChange('w-4-form');

                    // Scroll to the top of the page
                    window.scrollTo(0, 0);
                }
            }
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
        <div className="i-9form">
            <Header onPageChange={onPageChange} />

            <nav className="breadcrumb">
                Home &gt; Farmer details &gt; Form List &gt; DE-4
            </nav>

            <div className="i9-form_container">
                <div className="development-dept">
                    <img src={development_logo} alt="Development Logo" width="280px" className="EDD-mainlogo" />
                    <button className="clear-form-btn">Clear Form</button>
                </div>
                <div className="Allowance-certificate">
                    <h2 className="certificate-heading">
                        Employee’s Withholding Allowance Certificate
                    </h2>
                    <p>
                        Complete this form so that your employer can withhold the correct
                        California state income tax from your paycheck.
                    </p>
                    <br />
                    <h2 className="i9-personal-info">Enter Personal Information</h2>
                    <form className="Allowance-form" id="allowanceForm">
                        <div className="grid-row-1">
                            <div className="i9-input">
                                <label for="first-name">First Name</label>
                                <input type="hidden" name="employee_id" id="employee_id" />
                                <input type="text" id="first-name" className="w4-form-feild" name="first_name" value={employeeData.firstName} readonly={true} />
                            </div>
                            <div className="i9-input">
                                <label for="middle-name">Middle Name</label>
                                <input type="text" id="middle-name" className="w4-form-feild" name="middle_name" value={employeeData.middleName} readonly={true} />
                            </div>
                            <div className="i9-input">
                                <label for="last-name">Last Name</label>
                                <input type="text" id="last-name" className="w4-form-feild" name="last_name" value={employeeData.lastName} readonly={true} />
                            </div>
                            <div className="i9-input">
                                <label for="last-name">Social Security Number</label>
                                <input type="text" id="last-name" className="w4-form-feild" name="ssn" value={employeeData.ssn} readonly={true} />
                            </div>
                        </div>
                        <div className="cerificate-address">
                            <div className="adresss">
                                <label for="address">Address</label>
                                <input type="text" name="address" value={employeeData.streetAddress} readonly={true} />
                                <div className="zip-code-section">
                                    <div>
                                        <label for="City">City</label>
                                        <input type="text" name="city" value={employeeData.city} readonly={true} />
                                    </div>
                                    <div>
                                        <label for="State">State</label>
                                        <input type="text" name="state" value={employeeData.state} readonly={true} />
                                    </div>
                                    <div>
                                        <label for="zip   ">Zip Code</label>
                                        <input type="text" name="zip" value={employeeData.zip} readonly={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="filing-status">
                                <p>State - Filing - Status</p>
                                <label>
                                    <input type="checkbox" name="single_or_married" />
                                    <p>
                                        Single or Married (with two or more incomes)
                                        <strong>S</strong>
                                    </p>
                                </label>
                                <label>
                                    <input type="checkbox" name="married" />
                                    <p>Married (one income)<strong> M</strong></p>
                                </label>
                                <label>
                                    <input type="checkbox" name="head_of_household" />
                                    <p>Head of Household<strong> H</strong></p>
                                </label>
                            </div>
                        </div>
                        {/* </div> */}

                        <div className="form-section-second">
                            <div className="worksheet-inner-section">
                                <p>
                                    1. Use Worksheet A for Regular Withholding allowances. Use other
                                    worksheets on the following pages as applicable.
                                </p>
                                <div className="form-row-second">
                                    <label for="worksheet-a">1a. Number of Regular Withholding Allowances
                                        <strong>(Worksheet A)</strong></label>
                                    <input type="text" id="worksheet-a" name="worksheet_a" /><span className="estimated-text"></span>
                                </div>
                                <div className="form-row-second">
                                    <label for="worksheet-b">1b. Number of allowances from the Estimated Deductions
                                        <strong>(Worksheet B, if applicable)</strong></label>
                                    <input type="text" id="worksheet-b" name="worksheet_b" /><span className="estimated-text"></span>
                                </div>
                                <div className="form-row-second">
                                    <label for="total-allowances">1c. Total Number of Allowances you are claiming</label>
                                    <input type="text" id="total-allowances" name="total_allowances" /><span className="estimated-text">1a + 1b State
                                        -OEP</span>
                                </div>
                                <div className="form-row-second">
                                    <label for="additional-amount">2. Additional amount, if any, you want withheld each pay period
                                        (if employer agrees), <strong>(Worksheet C)</strong></label>
                                    <input type="text" id="additional-amount" name="additional_amount" /><span className="estimated-text">ADDL - State -
                                        WHT</span>
                                </div>
                            </div>

                            <p><strong>Exemption from Withholding</strong></p>
                            <div className="form-row checkbox-label">
                                <label for="exemption-1" className="exemption-1">
                                    3. I claim exemption from withholding for 2024, and I certify I
                                    meet both of the conditions for exemption.
                                </label>
                                <div className="exemption-checkbox">
                                    <span>(Check box here)</span>
                                    <input type="checkbox" id="exemption-1" name="exemption_1" />
                                </div>
                            </div>
                            <div className="form-row checkbox-label">
                                <label for="exemption-2" className="exemption-2">
                                    4. I certify under penalty of perjury that I am
                                    <strong>not subject</strong> to California withholding. I meet the
                                    conditions set forth under the Service Member Civil Relief Act, as
                                    amended by the Military Spouses Residency Relief Act and the
                                    Veterans Benefits and Transition Act of 2018.
                                </label>
                                <div className="exemption-checkbox">
                                    <span>(Check box here)</span>
                                    <input type="checkbox" id="exemption-2" name="exemption_2" />
                                </div>
                            </div>

                            <div className="signature-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                                <span>Employee's Signature</span>
                                <canvas id="signatureCanvas" style={{ border: "1px solid #ccc", marginLeft: "10px", marginRight: "10px", flexShrink: "0" }} width="300" height="50"></canvas>
                                <input type="hidden" id="signatureInput" name="employee_signature" />
                                <span style={{ marginLeft: "900px" }}>Date</span>
                                <input type="date" className="date-field" name="date" style={{ marginLeft: " 10px" }} />
                            </div>

                        </div>

                        <div className="employer_purpose">
                            <p className="penalties-text">
                                Under the penalties of perjury, I certify that the number of
                                withholding allowances claimed on this certificate does not exceed
                                the number to which I am entitled or, if claiming exemption from
                                withholding, that I am entitled to claim the exempt status.
                            </p>

                            <div className="payroll-tax-container">
                                <div className="employer-section">
                                    <p className="section-heading">
                                        Employer’s Section: Employer’s Name and Address
                                    </p>
                                    <p className="section-address">
                                        HALL MANAGEMENENT GROUP, INC.<br />
                                        4720 W JENNIFER AVE #108<br />
                                        FRESNO, CA 93722
                                    </p>
                                </div>
                                <div className="account-number">
                                    <p className="section-heading">
                                        California Employer Payroll Tax Account Number
                                    </p>
                                    <p className="section-address">515 - 5397 - 2</p>
                                </div>
                            </div>
                        </div>

                        <div className="general_instruction i-9-instruction">
                            <div className="leftside-content">
                                <p>
                                    Purpose: The Employee’s Withholding Allowance Certificate (DE 4)
                                    is for California Personal Income Tax (PIT) withholding purposes
                                    only. The DE 4 is used to compute the amount of taxes to be
                                    withheld from your wages, by your employer, to accurately reflect
                                    your state tax withholding obligation.<br /><br />

                                    Beginning January 1, 2020, Employee’s Withholding Allowance
                                    Certificate (Form W-4) from the Internal Revenue Service (IRS)
                                    will be used for federal income tax withholding only. You must
                                    file the state form DE 4 to determine the appropriate California
                                    PIT withholding <br /><br />

                                    If you do not provide your employer with a DE 4, the employer must
                                    use Single with Zero withholding allowance. <br /><br />

                                    Check Your Withholding: After your DE 4 takes effect, compare the
                                    state income tax withheld with your estimated total annual tax.
                                    For state withholding, use the worksheets on this form.
                                    <br /><br />

                                    Exemption From Withholding: If you wish to claim exempt, complete
                                    the federal Form W-4 and the state DE 4. You may claim exempt from
                                    withholding California income tax if you meet both of the
                                    following conditions for exemption
                                </p>
                            </div>
                            <div className="rightside-content">
                                <p>
                                    1. You did not owe any federal/state income tax last year, and
                                    <br />
                                    2. You do not expect to owe any federal/state income tax this
                                    year. The exemption is good for one year<br />

                                    If you continue to qualify for the exempt filing status, a new DE
                                    4 designating exempt must be submitted by February 15 each year to
                                    continue your exemption. If you are not having federal/state
                                    income tax withheld this year but expect to have a tax liability
                                    next year, you are required to give your employer a new DE 4 by
                                    December 1.<br />

                                    Member Service Civil Relief Act: Under this act, as provided by
                                    the Military Spouses Residency Relief Act and the Veterans
                                    Benefits and Transition Act of 2018, you may be exempt from
                                    California income tax withholding on your wages if<br />

                                    (i) Your spouse is a member of the armed forces present in
                                    California in compliance with military orders; <br />

                                    (ii) You are present in California solely to be with your spouse;
                                    and <br />

                                    (iii) You maintain your domicile in another state. If you claim
                                    exemption under this act, check the box on Line <br />

                                    4. You may be required to provide proof of exemption upon request.
                                </p>
                            </div>
                        </div>
                        <p>
                            The California Employer’s Guide (DE 44)
                            (edd.ca.gov/pdf_pub_ctr/de44.pdf) provides the income tax withholding
                            tables. This publication may be found by visiting Payroll Taxes -
                            Forms and Publications (edd.ca.gov/Payroll_Taxes/Forms_and_
                            Publications.htm). To assist you in calculating your tax liability,
                            please visit the Franchise Tax Board (FTB) (ftb.ca.gov).
                        </p>

                        <h4 className="ftp-form-heading">
                            If you need information on your last California Resident Income Tax
                            Return (FTB Form 540), visit the FTB (ftb.ca.gov).
                        </h4>
                        <div className="general_instruction ftp-form">
                            <div className="leftside-content">
                                <p>
                                    Notification: The burden of proof rests with the employee to show
                                    the correct California income tax withholding. Pursuant to section
                                    4340-1(e) of Title 22, California Code of Regulations (CCR) (govt.
                                    westlaw.com/calregs/Search/Index), the FTB or the EDD may, by
                                    special direction in writing, require an employer to submit a Form
                                    W-4 or DE 4 when such forms are necessary for the administration
                                    of the withholding tax programs
                                </p>
                            </div>
                            <div className="rightside-content">
                                <p>
                                    Penalty: You may be fined $500 if you file, with no reasonable
                                    basis, a DE 4 that results in less tax being withheld than is
                                    properly allowable. In addition, criminal penalties apply for
                                    willfully supplying false or fraudulent information or failing to
                                    supply information requiring an increase in withholding. This is
                                    provided by section 13101 of the California Unemployment Insurance
                                    Code (leginfo. legislature.ca.gov/faces/codes.xhtml) and section
                                    19176 of the Revenue and Taxation Code
                                    (leginfo.legislature.ca.gov/faces/ codes.xhtml)
                                </p>
                            </div>
                        </div>

                        <h4 className="ftp-form-heading">Worksheets</h4>
                        <div className="general_instruction ftp-form">
                            <div className="leftside-content">
                                <h3>Instructions — 1 — Allowances*</h3>
                                <p>
                                    When determining your withholding allowances, you must consider
                                    your personal situation: <br />
                                    — Do you claim allowances for dependents or blindness? <br />—
                                    Will you itemize your deductions? <br />
                                    — Do you have more than one income coming into the household?
                                </p>
                                <br />
                                <p>
                                    Two-Earners/Multiple Incomes: When earnings are derived from more
                                    than one source, under-withholding may occur. If you have a
                                    working spouse or more than one job, it is best to check the box
                                    “SINGLE or MARRIED (with two or more incomes).” Figure the total
                                    number of allowances you are entitled to claim on all jobs using
                                    only one DE 4 form. Claim allowances with one employer.
                                </p>
                                <br />
                                <p>
                                    Do not claim the same allowances with more than one employer. Your
                                    withholding will usually be most accurate when all allowances are
                                    claimed on the DE 4 filed for the highest paying job and zero
                                    allowances are claimed for the others.
                                </p>
                            </div>
                            <div className="rightside-content">
                                <p>
                                    Married But Not Living With Your Spouse: You may check the “Head
                                    of Household” <br />
                                    marital status box if you meet all of the following tests:<br />
                                    (1) Your spouse will not live with you at any time during the
                                    year;<br />
                                    (2) You will furnish over half of the cost of maintaining a home
                                    for the entire year for yourself and your child or stepchild who
                                    qualifies as your dependent; and<br />
                                    (3) You will file a separate return for the year.
                                </p>
                                <br />
                                <p>
                                    Head of Household: To qualify, you must be unmarried or legally
                                    separated from your spouse and pay more than 50% of the costs of
                                    maintaining a home for the entire year for yourself and your
                                    dependent(s) or other qualifying individuals. Cost of maintaining
                                    the home includes such items as rent, property insurance, property
                                    taxes, mortgage interest, repairs, utilities, and cost of food. It
                                    does not include the individual’s personal expenses or any amount
                                    which represents value of services performed by a member of the
                                    household of the taxpayer.
                                </p>
                            </div>
                        </div>

                        <div className="job_worksheet">
                            <div className="multiple_job_heading">
                                <p>Regular Withholding Allowances</p>
                            </div>

                            <div className="job-worksheet-input-1">
                                <div className="grid-row other-adjustment-content">
                                    <div className="worksheet-inputs">
                                        <p>(A) Allowance for yourself — enter 1</p>
                                        (A) <input type="text" placeholder="$" name="allowance_a" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            (B) Allowance for your spouse (if not separately claimed by
                                            your spouse) — enter 1
                                        </p>
                                        (B) <input type="text" placeholder="$" name="allowance_b" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>(C) Allowance for blindness — yourself — enter 1</p>
                                        (C) <input type="text" placeholder="$" name="allowance_c" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            (D) Allowance for blindness — your spouse (if not separately
                                            claimed by your spouse) — enter 1
                                        </p>
                                        (D) <input type="text" placeholder="$" name="allowance_d" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            (E) Allowance(s) for dependent(s) — do not include yourself or
                                            your spouse
                                        </p>
                                        (E) <input type="text" placeholder="$" name="allowance_e" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            (F) Total — add lines (A) through (E) above and enter on line
                                            1a of the DE 4
                                        </p>
                                        (F) <input type="text" placeholder="$" name="allowance_f" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="job_worksheet">
                            <div className="multiple_job_heading">
                                <p>Estimated Deductions</p>
                                <p>
                                    Use this worksheet only if you plan to itemize deductions, claim
                                    certain adjustments to income, or have a large amount of nonwage
                                    income not subject to withholding.
                                </p>
                            </div>

                            <div className="job-worksheet-input">
                                <div className="grid-row other-adjustment-content">
                                    <div className="worksheet-inputs">
                                        <p>
                                            1. Enter an estimate of your itemized deductions for
                                            California taxes for this tax year as listed in the schedules
                                            in the FTB Form 540
                                        </p>
                                        1. <input type="text" placeholder="$" name="deduction_1" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            2. Enter $10,726 if married filing joint with two or more
                                            allowances, unmarried head of household, or qualifying
                                            widow(er) with dependent(s) or $5,363 if single or married
                                            filing separately, dual income married, or married with
                                            multiple employers
                                        </p>
                                        2. <input type="text" placeholder="$" name="deduction_2" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>3. Subtract line 2 from line 1, enter difference</p>
                                        3. <input type="text" placeholder="$" name="deduction_3" />
                                    </div>

                                    <div className="worksheet-inputs">
                                        <p>
                                            4. Enter an estimate of your adjustments to income (alimony
                                            payments, IRA deposits)
                                        </p>
                                        4. <input type="text" placeholder="$" name="deduction_4" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>5. Add line 4 to line 3, enter sum</p>
                                        5. <input type="text" placeholder="$" name="deduction_5" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            6. Enter an estimate of your nonwage income (dividends,
                                            interest income, alimony receipts)
                                        </p>
                                        6. <input type="text" placeholder="$" name="deduction_6" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            7. If line 5 is greater than line 6 (if less, see below [go to
                                            line 9]); Subtract line 6 from line 5, enter difference
                                        </p>
                                        7. <input type="text" placeholder="$" name="deduction_7" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            8. Divide the amount on line 7 by $1,000, round any fraction
                                            to the nearest whole number 8. enter this number on line 1b of
                                            the DE 4. Complete Worksheet C, if needed, otherwise stop
                                            here.
                                        </p>
                                        8. <input type="text" placeholder="$" name="deduction_8" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            9. If line 6 is greater than line 5; Enter amount from line 6
                                            (nonwage income)
                                        </p>
                                        9. <input type="text" placeholder="$" name="deduction_9" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>10. Enter amount from line 5 (deductions)</p>
                                        10. <input type="text" placeholder="$" name="deduction_10" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            11. Subtract line 10 from line 9, enter difference. Then,
                                            complete Worksheet C
                                        </p>
                                        11. <input type="text" placeholder="$" name="deduction_11" />
                                    </div>
                                </div>
                            </div>
                            <p>
                                *Wages paid to registered domestic partners will be treated the same
                                for state income tax purposes as wages paid to spouses for
                                California PIT withholding and PIT wages. This law does not impact
                                federal income tax law. A registered domestic partner means an
                                individual partner in a domestic partner relationship within the
                                meaning of section 297 of the Family Code. For more information,
                                please call our Taxpayer Assistance Center at 1-888-745-3886.
                            </p>
                        </div>

                        <div className="job_worksheet">
                            <div className="multiple_job_heading">
                                <p>
                                    Instructions — 2 — (Optional) Additional Withholding Allowances
                                </p>
                            </div>

                            <div className="job-worksheet-input">
                                <p>
                                    If you expect to itemize deductions on your California income tax
                                    return, you can claim additional withholding allowances. Use
                                    Worksheet B to determine whether your expected estimated
                                    deductions may entitle you to claim one or more additional
                                    withholding allowances. Use last year’s FTB Form 540 as a model to
                                    calculate this year’s withholding amounts. Do not include deferred
                                    compensation, qualified pension payments, or flexible benefits,
                                    etc., that are deducted from your gross pay but are not taxed on
                                    this worksheet. You may reduce the amount of tax withheld from
                                    your wages by claiming one additional withholding allowance for
                                    each $1,000, or fraction of $1,000, by which you expect your
                                    estimated deductions for the year to exceed your allowable
                                    standard deduction.
                                </p>
                            </div>
                        </div>

                        <div className="job_worksheet">
                            <div className="multiple_job_heading">
                                <p>Additional Tax Withholding and Estimated Tax</p>
                                <p>
                                    Use this worksheet only if you plan to itemize deductions, claim
                                    certain adjustments to income, or have a large amount of nonwage
                                    income not subject to withholding.
                                </p>
                            </div>

                            <div className="job-worksheet-input">
                                <div className="grid-row other-adjustment-content">
                                    <div className="worksheet-inputs">
                                        <p>1. Enter estimate of total wages for tax year 2024</p>
                                        1. <input type="text" placeholder="$" name="estimated_tax_1" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            2. Enter estimate of nonwage income (line 6 of Worksheet B)
                                        </p>
                                        2. <input type="text" placeholder="$" name="estimated_tax_2" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>3. Add line 1 and line 2. Enter sum</p>
                                        3. <input type="text" placeholder="$" name="estimated_tax_3" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            4. Enter itemized deductions or standard deduction (line 1 or
                                            2 of Worksheet B, whichever is largest)
                                        </p>
                                        4. <input type="text" placeholder="$" name="estimated_tax_4" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>5. Enter adjustments to income (line 4 of Worksheet B).</p>
                                        5. <input type="text" placeholder="$" name="estimated_tax_5" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>6. Add line 4 and line 5. Enter sum.</p>
                                        6. <input type="text" placeholder="$" name="estimated_tax_6" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>7. Subtract line 6 from line 3. Enter difference.</p>
                                        7. <input type="text" placeholder="$" name="estimated_tax_7" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            8. Figure your tax liability for the amount on line 7 by using
                                            the 2024 tax rate schedules below
                                        </p>
                                        8. <input type="text" placeholder="$" name="estimated_tax_8" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            9. Enter personal exemptions (line F of Worksheet A x
                                            $158.40).
                                        </p>
                                        9. <input type="text" placeholder="$" name="estimated_tax_9" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>10. Subtract line 9 from line 8. Enter difference</p>
                                        10. <input type="text" placeholder="$" name="estimated_tax_10" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>11. Enter any tax credits. (See FTB Form 540)</p>
                                        11. <input type="text" placeholder="$" name="estimated_tax_11" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            12. Subtract line 11 from line 10. Enter difference. This is
                                            your total tax liability
                                        </p>
                                        12. <input type="text" placeholder="$" name="estimated_tax_12" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            13. Calculate the tax withheld and estimated to be withheld
                                            during 2024. Contact your employer to request the amount that
                                            will be withheld on your wages based on the marital status and
                                            number of withholding allowances you will claim for 2024.
                                            Multiply the estimated amount to be withheld by the number of
                                            pay periods left in the year. Add the total to the amount
                                            already withheld for 2024.
                                        </p>
                                        13. <input type="text" placeholder="$" name="estimated_tax_13" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            14. Subtract line 13 from line 12. Enter difference. If this
                                            is less than zero, you do not need to have additional taxes
                                            withheld.
                                        </p>
                                        14. <input type="text" placeholder="$" name="estimated_tax_14" />
                                    </div>
                                    <div className="worksheet-inputs">
                                        <p>
                                            15. Subtract line 13 from line 12. Enter difference. If this
                                            is less than zero, you do not need to have additional taxes
                                            withheld.
                                        </p>
                                        15. <input type="text" placeholder="$" name="estimated_tax_15" />
                                    </div>
                                </div>
                            </div>

                            Note: Your employer is not required to withhold the additional amount
                            requested on line 2 of your DE 4. If your employer does not agree to
                            withhold the additional amount, you may increase your withholdings as
                            much as possible by using the “single” status with “zero” allowances.
                            If the amount withheld still results in an underpayment of state
                            income taxes, you may need to file quarterly estimates on Form 540-ES
                            with the FTB to avoid a penalty
                        </div>

                        <h4 className="worksheet-c-heading">
                            These Tables Are for Calculating Worksheet C and for 2024 Only
                        </h4>
                        <div className="worksheet-c">
                            <div className="taxable-income">
                                <table className="i9-table">
                                    <thead className="i9-head">
                                        <th>OVER</th>
                                        <th>BUT NOT OVER</th>
                                        <th>OF AMOUNT OVER ...</th>
                                        <th></th>
                                        <th>PLUS</th>
                                    </thead>
                                    <tbody className="i9-body">
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="computed-tax">
                                <table className="i9-table">
                                    <thead className="i9-head">
                                        <th>OVER</th>
                                        <th>BUT NOT OVER</th>
                                        <th>OF AMOUNT OVER ...</th>
                                        <th></th>
                                        <th>PLUS</th>
                                    </thead>
                                    <tbody className="i9-body">
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="worksheet-c">
                            <div className="taxable-income">
                                <table className="i9-table">
                                    <thead className="i9-head">
                                        <th>OVER</th>
                                        <th>BUT NOT OVER</th>
                                        <th>OF AMOUNT OVER ...</th>
                                        <th></th>
                                        <th>PLUS</th>
                                    </thead>
                                    <tbody className="table-body">
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                        <tr className="i9-body-row">
                                            <td>$0</td>
                                            <td>$10,412</td>
                                            <td>$1.100%</td>
                                            <td>$0</td>
                                            <td>$0.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="computed-tax">
                                <hr />
                                <p>
                                    If you need information on your last California Resident Income
                                    Tax Return, FTB Form 540, visit(FTB)(ftb.ca.gov).
                                </p>
                            </div>
                        </div>
                        <hr />
                        <p>
                            The DE 4 information is collected for purpose of administering the PIT
                            law and under the authority of Title 22, CCR +, section 4340-1, and
                            the California Revenue and Taxation Code, including section 18624. The
                            information Practices Act of 1977 requires that individuals be
                            notified of how information they provide may be used. Further
                            information is contained in the instructions that came with your last
                            California resident income tax return.
                        </p>
                        <br />
                    </form>
                    <p>DE 4 Rev.53 (12-23)(INTERNET)</p>
                    <div className="next-save-button">
                        <button type="button" id="submitBtn" className="save-btn" onClick={handleSaveAndNext}>Save & Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
