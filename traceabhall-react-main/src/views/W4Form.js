import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './../images/TraceabHALL.png';
import user_image from './../images/default-profile.png';
import Cookies from 'js-cookie';
import { Header } from "./../components/Header";

export const W4Form = ({ onPageChange }) => {
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
                    console.log(data);

                    // Update the current_state property
                    data.current_state = 'w-4-form';

                    console.log("data.current_state");
                    console.log(data.current_state);

                    // Save the updated data back to the same key in localStorage
                    localStorage.setItem(localStorageKey, JSON.stringify(data));

                    onPageChange('list-page');

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
        <div>
            <div class="w4-form-container">
                <Header onPageChange={onPageChange} />

                <nav class="breadcrumb">
                    Home &gt; Farmer details &gt; Form List &gt; W4-Form
                </nav>
                <form id="w4-form" style={{ display: 'unset' }}>
                    <div class="form-header">
                        <div class="header-left">
                            <p class="left_content">
                                Form <strong class="w4-strong">W-4</strong><br />
                                Department of the Treasury<br />
                                Internal Revenue Service
                            </p>
                        </div>
                        <div class="header-center">
                            <h1 class="emp-certificate">Employee’s Withholding Certificate</h1>
                            <p class="emp-subhead">
                                Complete Form W-4 so that your employer can withhold the correct
                                federal income tax from your pay.<br />
                                Give Form W-4 to your employer.<br />
                                Your withholding is subject to review by the IRS.
                            </p>
                        </div>
                        <div class="header-right">
                            <p class="omb_number">OMB No. 1545-0074</p>
                            <p class="w4-year">2024</p>
                        </div>
                    </div>

                    <div class="form-step-1">
                        <div class="personal-info-heading">
                            <h2>Step 1: Enter Personal Information</h2>
                        </div>
                        <div class="w4-step-grid">
                            <div class="grid-row">
                                <div class="w4-input">
                                    <label for="first-name">First Name</label>
                                    <input type="text" id="first-name" class="w4-form-feild" name="first_name" value={employeeData.firstName} readOnly />
                                </div>
                                <div class="w4-input">
                                    <label for="middle-name">Middle Name</label>
                                    <input type="text" id="middle-name" class="w4-form-feild" name="middle_name" value={employeeData.middleName} readOnly />
                                </div>
                                <div class="w4-input">
                                    <label for="last-name">Last Name</label>
                                    <input type="text" id="last-name" class="w4-form-feild" name="last_name" value={employeeData.lastName} readOnly />
                                </div>
                                <div class="w4-input">
                                    <label for="last-name">Social Security Number</label>
                                    <input type="text" id="last-name" class="w4-form-feild" name="ssn" value={employeeData.ssn} readOnly />
                                </div>
                            </div>

                            <div class="address-section">
                                <div class="address-inputs">
                                    <div class="grid-row">
                                        <div class="streetinput-section">
                                            <label for="street-address">Street Address</label>
                                            <input type="text" id="street-address" placeholder="" class="w4-street-add"
                                                name="street_address" value={employeeData.streetAddress} readOnly />
                                        </div>
                                    </div>

                                    <div class="grid-row">
                                        <div class="w4-input-city">
                                            <label for="city">City or Town</label>
                                            <input type="text" id="city" placeholder="" class="w4-form-feild" name="city"
                                                value={employeeData.city} readonly />
                                        </div>
                                        <div class="w4-input-city">
                                            <label for="state">State</label>
                                            <input type="text" id="state" placeholder="" class="w4-form-feild" name="state"
                                                value={employeeData.state} readonly />
                                        </div>
                                        <div class="w4-input-city">
                                            <label for="zip-code">ZIP Code</label>
                                            <input type="text" id="zip-code" placeholder="" class="w4-form-feild" name="zip"
                                                value={employeeData.zip} readonly />
                                        </div>
                                    </div>

                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><input type="checkbox" id="single-married"
                                                        name="single_or_married" /></td>
                                                    <td>
                                                        <strong>Single or Married filing separately
                                                            <span>S</span></strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" id="single-married" name="married" /></td>
                                                    <td>
                                                        <strong>Married filing jointly or Qualifying surviving spouse
                                                            <span>M</span></strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input type="checkbox" id="single-married"
                                                        name="head_of_household" /></td>
                                                    <td>
                                                        <strong>Head of household </strong>(Check only if you’re
                                                        unmarried and pay more than half the costs of keeping up
                                                        a home for yourself and a qualifying individual.)
                                                        <strong>H</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="right-box-text">
                                    <p>
                                        <strong>Does your name match the name on your social security
                                            card?</strong>
                                        If not, to ensure you get credit for your earnings, contact SSA
                                        at 800-772-1213 or go to www.ssa.gov.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="steps-container">
                        <div class="step-section">
                            <p class="">
                                <strong>Complete Steps 2–4 ONLY if they apply to you; otherwise, skip to
                                    Step 5</strong>. See page 2 for more information on each step, who can claim
                                exemption from withholding, and when to use the estimator at
                                www.irs.gov/W4App.
                            </p>
                            <div class="step-second">
                                <div class="step-2-heading">
                                    <h2>Step 2: Multiple Jobs or Spouse Works</h2>
                                </div>
                                <div class="second-right-side">
                                    <p>
                                        Complete this step if you (1) hold more than one job at a time,
                                        or (2) are married filing jointly and your spouse also works.
                                        The correct amount of withholding depends on income earned from
                                        all of these jobs.
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Do only one of the following:</strong>
                                            <ol>
                                                <li>
                                                    (a) Use the estimator at
                                                    <a href="https://www.irs.gov/W4App" target="_blank">irs.gov/W4App</a>
                                                    for the most accurate withholding for this step (and Steps
                                                    3–4). If you or your spouse have self-employment income,
                                                    use this option; or
                                                </li>
                                                <li>
                                                    (b) Use the Multiple Jobs Worksheet on page 3 and enter
                                                    the result in Step 4(c) below; or
                                                </li>
                                                <li>
                                                    (c) If there are only two jobs total, you may check this
                                                    box. Do the same on Form W-4 for the other job. This
                                                    option is generally more accurate than (b) if pay at the
                                                    lower paying job is more than half of the pay at the
                                                    higher paying job. Otherwise, (b) is more accurate.
                                                </li>
                                            </ol>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p>
                                <strong>Complete Steps 3–4(b) on Form W-4 for only ONE of these
                                    jobs.</strong>
                                Leave those steps blank for the other jobs. (Your withholding will
                                be most accurate if you complete Steps 3–4(b) on the Form W-4 for
                                the highest paying job.)
                            </p>
                        </div>

                        <div class="step-section second-step">
                            <div class="leftside-step3">
                                <h2>Step 3: Claim Dependent and Other Credits</h2>
                            </div>
                            <div class="step3-section">
                                <p>
                                    If your total income will be $200,000 or less ($400,000 or less if
                                    married filing jointly):
                                </p>
                                <div class="Amount-left-section">
                                    <div class="grid-row other_credit-section">
                                        <div class="other-credit-inputs">
                                            <label>Multiply the number of qualifying children under age 17 by
                                                $2,000
                                            </label>
                                            <input type="text" name="amount1" />
                                            <p>(Amount 1)</p>
                                        </div>

                                        <div class="other-credit-inputs">
                                            <label>Multiply the number of other dependents by $500</label>
                                            <input type="text" name="amount2" />
                                            <p>(Amount 2)</p>
                                        </div>
                                    </div>
                                    <div class="second-section-3">
                                        <p>3</p>
                                    </div>
                                    <div class="total-amount-credit">
                                        <p>W4 - DEP- Credits Amount 1 + Amount 2</p>
                                        <input type="number" cslass="dep-credit" name="total" />
                                    </div>
                                </div>
                                <p>
                                    Add the amounts above for qualifying children and other
                                    dependents. You may add to this the amount of any other credits.
                                    Enter the total here.
                                </p>
                            </div>
                        </div>

                        <div class="step-section other-adjustment">
                            <div class="leftside-step3">
                                <h2>Step 4 (optional): Other Adjustments</h2>
                            </div>
                            <div class="grid-row other-adjustment-content">
                                <div class="worksheet-inputs">
                                    <p>
                                        (a) W4 - Other income (not from jobs). If you want tax withheld
                                        for other income you expect this year that won’t have
                                        withholding, enter the amount of other income here. This may
                                        include interest, dividends, and retirement income . . . . . . .
                                        .
                                    </p>
                                    4(a) <input type="text" placeholder="" name="adjustments_4_a" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        (b) W4 - Deductions. If you expect to claim deductions other
                                        than the standard deduction and want to reduce your withholding,
                                        use the Deductions Worksheet on page 3 and enter the result here
                                        . . . . . . . . . . . . . . . . . . . . . . .
                                    </p>
                                    4(b)<input type="text" placeholder="" name="adjustments_4_b" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        (c) ADDL - FED - WHT tExtra withholding. Enter any additional
                                        tax you want withheld each pay period . .
                                    </p>
                                    4(c)<input type="text" placeholder="" name="adjustments_4_c" />
                                </div>
                            </div>
                            {/* <div class="other-adjustment-amount">
                          <input type="text" placeholder="$" />
                          <input type="text" placeholder="$" />
                          <input type="text" placeholder="$" />
                        </div> */}
                        </div>

                        <div class="step-section Signature-container">
                            <div class="leftside-step3">
                                <h2>Step 5: Sign Here</h2>
                            </div>
                            <div class="signature-rightside">
                                <p>
                                    Under penalties of perjury, I declare that this certificate, to
                                    the best of my knowledge and belief, is true, correct, and
                                    complete.
                                </p>
                                <div class="signature-section">
                                    <div class="Employee-Signature">
                                        <canvas id="signatureCanvas" width="351" height="47" style={{ border: "1px solid #ccc" }}></canvas>
                                        <input type="hidden" id="signatureInput" placeholder=""
                                            name="employee_signature" />
                                        <label for="employee-signature">Employee’s signature (This form is not valid unless
                                            you sign
                                            it.)</label>
                                    </div>
                                    <div class="Employee-date">
                                        <input type="date" id="date" name="date" />
                                        <label for="date">Date</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="employers-section">
                            <div class="leftside-step3">
                                <h2>Employers Only</h2>
                            </div>
                            <div class="employer-grid-row">
                                <div class="name-and-address">
                                    <label>Employer’s name and address:</label>
                                    <input type="text" placeholder="Enter employer details" name="employer_name" />
                                </div>
                                <div class="date-of-employment">
                                    <label>First date of employment:</label>
                                    <input type="date" name="date_of_employment" />
                                </div>
                                <div class="Employer-identification">
                                    <label>Employer identification number (EIN):</label>
                                    <input type="text" placeholder="27 - 0097608" name="employer_ein" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="general_instruction">
                        <div class="leftside-content">
                            <h3>General Instructions</h3>
                            <p>
                                Section references are to the Internal Revenue Code. <br />
                                <strong>Future Developments </strong> <br />
                                For the latest information about developments related to Form W-4,
                                such as legislation enacted after it was published, go to
                                www.irs.gov/FormW4.<br />
                                <strong>Purpose of Form</strong><br />
                                Complete Form W-4 so that your employer can withhold the correct
                                federal income tax from your pay. If too little is withheld, you
                                will generally owe tax when you file your tax return and may owe a
                                penalty. If too much is withheld, you will generally be due a
                                refund. Complete a new Form W-4 when changes to your personal or
                                financial situation would change the entries on the form. For more
                                information on withholding and when you must furnish a new Form W-4,
                                see Pub. 505, Tax Withholding and Estimated Tax.<strong>
                                    Exemption from withholding</strong>. You may claim exemption from withholding for 2024
                                if you
                                meet
                                both of the following conditions: you had no federal income tax
                                liability in 2023 and you expect to have no federal income tax
                                liability in 2024. You had no federal income tax liability in 2023
                                if (1) your total tax on line 24 on your 2023 Form 1040 or 1040-SR
                                is zero (or less than the sum of lines 27, 28, and 29), or (2) you
                                were not required to file a return because your income was below the
                                filing threshold for your correct filing status. If you claim
                                exemption, you will have no income tax withheld from your paycheck
                                and may owe taxes and penalties when you file your 2024 tax return.
                                To claim exemption from withholding, certify that you meet both of
                                the conditions above by writing “Exempt” on Form W-4 in the space
                                below Step 4(c). Then, complete Steps 1(a), 1(b), and 5. Do not
                                complete any other steps. You will need to submit a new Form W-4 by
                                February 15, 2025. <br />
                                <strong>Your privacy</strong>. Steps 2(c) and 4(a) ask for
                                information regarding income you received from sources other than
                                the job associated with this Form W-4. If you have concerns with
                                providing the information asked for in Step 2(c), you may choose
                                Step 2(b) as an alternative; if you have concerns with providing the
                                information asked for in Step 4(a), you may enter an additional
                                amount you want withheld per pay period in Step 4(c) as an
                                alternative.<br />
                                <strong>When to use the estimator</strong>. Consider using the
                                estimator at www.irs.gov/W4App if you:<br />
                                1. Expect to work only part of the year;<br />
                                2. Receive dividends, capital gains, social security, bonuses, or
                                business income, or are subject to the Additional Medicare Tax or
                                Net Investment Income Tax; or <br />
                                3. Prefer the most accurate withholding for multiple job situations.
                                <strong>Self-employment</strong>. Generally, you will owe both
                                income and self-employment taxes on any self-employment income you
                                receive separate from the wages you receive as an employee. If you
                                want to pay these taxes through withholding from your wages, use the
                                estimator at www.irs.gov/W4App to figure the amount to have
                                withheld. <br />
                                <strong>Nonresident alien</strong>. If you’re a nonresident alien,
                                see Notice 1392, Supplemental Form W-4 Instructions for Nonresident
                                Aliens, before completing this form.
                            </p>
                        </div>
                        <div class="rightside-content">
                            <h3>Specific Instructions</h3>
                            <p>
                                Step 1(c). Check your anticipated filing status. This will determine
                                the standard deduction and tax rates used to compute your
                                withholding. Step 2. Use this step if you (1) have more than one job
                                at the same time, or (2) are married filing jointly and you and your
                                spouse both work. Option (a) most accurately calculates the
                                additional tax you need to have withheld, while option (b) does so
                                with a little less accuracy. Instead, if you (and your spouse) have
                                a total of only two jobs, you may check the box in option (c). The
                                box must also be checked on the Form W-4 for the other job. If the
                                box is checked, the standard deduction and tax brackets will be cut
                                in half for each job to calculate withholding. This option is
                                accurate for jobs with similar pay; otherwise, more tax than
                                necessary may be withheld, and this extra amount will be larger the
                                greater the difference in pay is between the two jobs <br />
                                <strong>Multiple jobs</strong>.Complete Steps 3 through 4(b) on only
                                one Form W-4. Withholding will be most accurate if you do this on
                                the Form W-4 for the highest paying job.<br />
                                <strong>Step 3</strong>. This step provides instructions for
                                determining the amount of the child tax credit and the credit for
                                other dependents that you may be able to claim when you file your
                                tax return. To qualify for the child tax credit, the child must be
                                under age 17 as of December 31, must be your dependent who generally
                                lives with you for more than half the year, and must have the
                                required social security number. You may be able to claim a credit
                                for other dependents for whom a child tax credit can’t be claimed,
                                such as an older child or a qualifying relative. For additional
                                eligibility requirements for these credits, see Pub. 501,
                                Dependents, Standard Deduction, and Filing Information. You can also
                                include other tax credits for which you are eligible in this step,
                                such as the foreign tax credit and the education tax credits. To do
                                so, add an estimate of the amount for the year to your credits for
                                dependents and enter the total amount in Step 3. Including these
                                credits will increase your paycheck and reduce the amount of any
                                refund you may receive when you file your tax return.<br />
                                <strong>Step 4 (optional)</strong>.<br />
                                <strong>Step 4(a)</strong>. Enter in this step the total of your
                                other estimated income for the year, if any. You shouldn’t include
                                income from any jobs or self-employment. If you complete Step 4(a),
                                you likely won’t have to make estimated tax payments for that
                                income. If you prefer to pay estimated tax rather than having tax on
                                other income withheld from your paycheck, see Form 1040-ES,
                                Estimated Tax for Individuals. <strong>Step 4(b)</strong>. Enter in
                                this step the amount from the Deductions Worksheet, line 5, if you
                                expect to claim deductions other than the basic standard deduction
                                on your 2024 tax return and want to reduce your withholding to
                                account for these deductions. This includes both itemized deductions
                                and other deductions such as for student loan interest and IRAs
                                <br />
                                <strong>Step 4(c)</strong>. Enter in this step any additional tax
                                you want withheld from your pay <strong>each pay period</strong>,
                                including any amounts from the Multiple Jobs Worksheet, line 4.
                                Entering an amount here will reduce your paycheck and will either
                                increase your refund or reduce any amount of tax that you owe
                            </p>
                        </div>
                    </div>

                    <div class="job_worksheet">
                        <div class="multiple_job_heading w4-heading">
                            <p>
                                <strong>Step 2(b)—Multiple Jobs Worksheet</strong> (Keep for your
                                records.)
                            </p>
                        </div>
                        <div class="multiple-job-content">
                            <p>
                                If you choose the option in Step 2(b) on Form W-4, complete this
                                worksheet (which calculates the total extra tax for all jobs) on
                                <strong>only ONE</strong> Form W-4. Withholding will be most
                                accurate if you complete the worksheet and enter the result on the
                                Form W-4 for the highest paying job. To be accurate, submit a new
                                Form W-4 for all other jobs if you have not updated your withholding
                                since 2019.
                            </p>
                            <br />
                            <p>
                                <strong>Note</strong>: If more than one job has annual wages of more
                                than $120,000 or there are more than three jobs, see Pub. 505 for
                                additional tables; or, you can use the online withholding estimator
                                at www.irs.gov/W4App.
                            </p>
                        </div>
                        <div class="job-worksheet-input">
                            <div class="grid-row other-adjustment-content">
                                <div class="worksheet-inputs">
                                    <p>
                                        1 Two jobs. If you have two jobs or you’re married filing
                                        jointly and you and your spouse each have one job, find the
                                        amount from the appropriate table on page 4. Using the “Higher
                                        Paying Job” row and the “Lower Paying Job” column, find the
                                        value at the intersection of the two household salaries and
                                        enter that value on line 1. Then, skip to line 3 . . . . . . . .
                                        . . . . . . . . . . . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="multiple_job_worksheet_1" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        2 <strong>Three jobs</strong>. If you and/or your spouse have
                                        three jobs at the same time, complete lines 2a, 2b, and 2c
                                        below. Otherwise, skip to line
                                    </p>
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        3 <strong>a</strong> Find the amount from the appropriate table
                                        on page 4 using the annual wages from the highest paying job in
                                        the “Higher Paying Job” row and the annual wages for your next
                                        highest paying job in the “Lower Paying Job” column. Find the
                                        value at the intersection of the two household salaries and
                                        enter that value on line 2a . . . . . . . . . . . . . . . . . .
                                        . . . . .
                                    </p>
                                    2a <input type="text" placeholder="$" name="multiple_job_worksheet_2" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        <strong>b</strong> Add the annual wages of the two highest
                                        paying jobs from line 2a together and use the total as the wages
                                        in the “Higher Paying Job” row and use the annual wages for your
                                        third job in the “Lower Paying Job” column to find the amount
                                        from the appropriate table on page 4 and enter this amount on
                                        line 2b . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                                        .
                                    </p>
                                    2b <input type="text" placeholder="$" name="multiple_job_worksheet_3" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        <strong>c</strong> Add the amounts from lines 2a and 2b and
                                        enter the result on line 2c . . . . . . . . . .
                                    </p>
                                    2c <input type="text" placeholder="$" name="multiple_job_worksheet_4" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        3 Enter the number of pay periods per year for the highest
                                        paying job. For example, if that job pays weekly, enter 52; if
                                        it pays every other week, enter 26; if it pays monthly, enter
                                        12, etc. . . . . .
                                    </p>
                                    3 <input type="text" placeholder="$" name="multiple_job_worksheet_5" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        4 Divide the annual amount on line 1 or line 2c by the number of
                                        pay periods on line 3. Enter this amount here and in Step 4(c)
                                        of Form W-4 for the highest paying job (along with any other
                                        additional amount you want withheld) . . . . . . . . . . . . . .
                                        . . . . . . . . . . .
                                    </p>
                                    4 <input type="text" placeholder="$" name="multiple_job_worksheet_6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="job_worksheet">
                        <div class="multiple_job_heading">
                            <p>
                                <strong>Step 4(b)—Deductions Worksheet</strong> (Keep for your
                                records.)
                            </p>
                        </div>

                        <div class="job-worksheet-input">
                            <div class="grid-row other-adjustment-content">
                                <div class="worksheet-inputs">
                                    <p>
                                        1 Enter an estimate of your 2024 itemized deductions (from
                                        Schedule A (Form 1040)). Such deductions may include qualifying
                                        home mortgage interest, charitable contributions, state and
                                        local taxes (up to $10,000), and medical expenses in excess of
                                        7.5% of your income . . . . . . . . . . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="deduction_worksheet_1" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        2 Enter: • $29,200 if you’re married filing jointly or a
                                        qualifying surviving spouse • $21,900 if you’re head of
                                        household • $14,600 if you’re single or married filing
                                        separately  . . . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="deduction_worksheet_2" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        3 If line 1 is greater than line 2, subtract line 2 from line 1
                                        and enter the result here. If line 2 is greater than line 1,
                                        enter “-0-” . . . . . . . . . . . . . . . . . . . . . . . . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="deduction_worksheet_3" />
                                </div>
                                <div class="worksheet-inputs">
                                    <p>
                                        4 Enter an estimate of your student loan interest, deductible
                                        IRA contributions, and certain other adjustments (from Part II
                                        of Schedule 1 (Form 1040)). See Pub. 505 for more information .
                                        . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="deduction_worksheet_4" />
                                </div>

                                <div class="worksheet-inputs">
                                    <p>
                                        5 Add lines 3 and 4. Enter the result here and in Step 4(b) of
                                        Form W-4 . . . . . . . . . . .
                                    </p>
                                    1 <input type="text" placeholder="$" name="deduction_worksheet_5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="general_instruction act-and-paperwork">
                        <div class="leftside-content">
                            <p>
                                <strong>Privacy Act and Paperwork Reduction Act Notice</strong>. We
                                ask for the information on this form to carry out the Internal
                                Revenue laws of the United States. Internal Revenue Code sections
                                3402(f)(2) and 6109 and their regulations require you to provide
                                this information; your employer uses it to determine your federal
                                income tax withholding. Failure to provide a properly completed form
                                will result in your being treated as a single person with no other
                                entries on the form; providing fraudulent information may subject
                                you to penalties. Routine uses of this information include giving it
                                to the Department of Justice for civil and criminal litigation; to
                                cities, states, the District of Columbia, and U.S. commonwealths and
                                territories for use in administering their tax laws; and to the
                                Department of Health and Human Services for use in the National
                                Directory of New Hires. We may also disclose this information to
                                other countries under a tax treaty, to federal and state agencies to
                                enforce federal nontax criminal laws, or to federal law enforcement
                                and intelligence agencies to combat terrorism.
                            </p>
                        </div>
                        <div class="rightside-content">
                            <p>
                                You are not required to provide the information requested on a form
                                that is subject to the Paperwork Reduction Act unless the form
                                displays a valid OMB control number. Books or records relating to a
                                form or its instructions must be retained as long as their contents
                                may become material in the administration of any Internal Revenue
                                law. Generally, tax returns and return information are confidential,
                                as required by Code section 6103. The average time and expenses
                                required to complete and file this form will vary depending on
                                individual circumstances. For estimated averages, see the
                                instructions for your income tax return. If you have suggestions for
                                making this form simpler, we would be happy to hear from you. See
                                the instructions for your income tax return.
                            </p>
                        </div>
                    </div>

                    <div class="w4-section-title">
                        Married Filing Jointly or Qualifying Surviving Spouse
                    </div>
                    <div class="w4-table-section">
                        <table class="w4-table">
                            <thead class="w4-head">
                                <tr class="w4-row">
                                    <th>Higher Paying Job<br />Annual Taxable Wage & Salary</th>
                                    <th>$0 - 9,999</th>
                                    <th>$10,000 - 19,999</th>
                                    <th>$20,000 - 29,999</th>
                                    <th>$30,000 - 39,999</th>
                                    <th>$40,000 - 49,999</th>
                                    <th>$50,000 - 59,999</th>
                                    <th>$60,000 - 69,999</th>
                                    <th>$70,000 - 79,999</th>
                                    <th>$80,000 - 89,999</th>
                                    <th>$90,000 - 100,000</th>

                                </tr>
                            </thead>
                            <tbody class="w4-body">
                                <tr class="w4-body-row">
                                    <td>$0 - 9,999</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>
                                    <td>$0</td>

                                </tr>
                                <tr class="w4-body-row">
                                    <td>$10,000 - 19,999</td>
                                    <td>$0</td>
                                    <td>$780</td>
                                    <td>$1,780</td>
                                    <td>$2,870</td>
                                    <td>$780</td>
                                    <td>$1,780</td>
                                    <td>$2,870</td>
                                    <td>$780</td>
                                    <td>$1,780</td>
                                    <td>$2,870</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="w4-section-title">Single or Married Filing Separately</div>
                    <div class="w4-table-section">
                        <table class="w4-table">
                            <thead class="w4-head">
                                <tr class="w4-row">
                                    <th>Higher Paying Job<br />Annual Taxable Wage & Salary</th>
                                    <th>$0 - 9,999</th>
                                    <th>$10,000 - 19,999</th>
                                    <th>$20,000 - 29,999</th>
                                    <th>$30,000 - 39,999</th>
                                    <th>$40,000 - 49,999</th>
                                    <th>$50,000 - 59,999</th>
                                    <th>$60,000 - 69,999</th>
                                    <th>$70,000 - 79,999</th>
                                    <th>$80,000 - 89,999</th>
                                    <th>$90,000 - 100,000</th>

                                </tr>
                            </thead>
                            <tbody class="w4-body">
                                <tr class="w4-body-row">
                                    <td>$0 - 9,999</td>
                                    <td>$240</td>
                                    <td>$870</td>
                                    <td>$1,710</td>
                                    <td>$2,250</td>
                                    <td>$870</td>
                                    <td>$1,710</td>
                                    <td>$2,250</td>
                                    <td>$870</td>
                                    <td>$1,710</td>
                                    <td>$2,250</td>

                                </tr>
                                <tr class="w4-body-row">
                                    <td>$10,000 - 19,999</td>
                                    <td>$870</td>
                                    <td>$1,830</td>
                                    <td>$2,730</td>
                                    <td>$3,510</td>
                                    <td>$1,830</td>
                                    <td>$2,730</td>
                                    <td>$3,510</td>
                                    <td>$1,830</td>
                                    <td>$2,730</td>
                                    <td>$3,510</td>

                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div class="next-save-button">
                        <button type="button" id="submitBtn" class="save-btn" onClick={handleSaveAndNext}>Save & Next</button>
                    </div>
                </form>
            </div>

        </div>
    );
};
