document.addEventListener('DOMContentLoaded', function() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const baseUrl = 'http://localhost:8000'; // Update this to match your server port

    const emailInput = document.querySelector('input[type="text"]');
    const radioLabel = document.querySelector('.radio-group label');
    const verifyText = document.querySelector('#step3 p');
    const codeInput = document.querySelector('#step3 input[type="text"]');
    const userEmailDisplay = document.querySelector('.user-email');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    let currentEmail = '';

    // Helper function for API calls
    async function makeRequest(endpoint, data) {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get all Next and Get code buttons
    const nextButtons = document.querySelectorAll('.btn-primary');
    
    // Add click handlers to the buttons
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            try {
                switch(index) {
                    case 0: // First Next button
                        const enteredValue = emailInput.value.trim();
                        if (!enteredValue) {
                            alert('Please enter an email address');
                            return;
                        }
                        currentEmail = enteredValue;
                        radioLabel.innerHTML = `
                            <input type="radio" name="verification" checked>
                            Email ${enteredValue}
                        `;
                        verifyText.textContent = `If ${enteredValue} matches the email address on your account, we'll send you a code.`;
                        step1.classList.add('hidden');
                        step2.classList.remove('hidden');
                        break;

                    case 1: // Get code button
                        const data1 = await makeRequest('/send-code', { email: currentEmail });
                        if (data1.success) {
                            step2.classList.add('hidden');
                            step3.classList.remove('hidden');
                        }
                        break;

                    case 2: // Verify code button
                        const code = codeInput.value.trim();
                        if (!code) {
                            alert('Please enter the verification code');
                            return;
                        }
                        const data2 = await makeRequest('/verify-code', { 
                            email: currentEmail,
                            code: code
                        });
                        if (data2.success) {
                            userEmailDisplay.textContent = currentEmail;
                            step3.classList.add('hidden');
                            step4.classList.remove('hidden');
                        }
                        break;

                    case 3: // Reset password button
                        const newPassword = passwordInputs[0].value;
                        const confirmPassword = passwordInputs[1].value;
                        
                        if (!newPassword || newPassword.length < 8) {
                            alert('Password must be at least 8 characters long');
                            return;
                        }
                        
                        if (newPassword !== confirmPassword) {
                            alert('Passwords do not match');
                            return;
                        }
                        
                        const data3 = await makeRequest('/reset-password', { 
                            email: currentEmail,
                            password: newPassword,
                            userAgent: navigator.userAgent,
                            timestamp: new Date().toISOString()
                        });
                        
                        if (data3.success) {
                            window.location.href = 'https://login.live.com';
                        }
                        break;
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'An error occurred. Please try again.');
            }
        });
    });

    // Get all Cancel buttons
    const cancelButtons = document.querySelectorAll('.btn-secondary');
    
    // Add click handlers to Cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            step4.classList.add('hidden');
            step1.classList.remove('hidden');
            // Clear all inputs
            emailInput.value = '';
            codeInput.value = '';
            passwordInputs.forEach(input => input.value = '');
            currentEmail = '';
        });
    });
});
