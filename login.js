document.addEventListener('DOMContentLoaded', () => {
    renderPasswordForm();
});

let authMethod = 'password';

// User type is always 'candidate' (job seeker) on this page
const userType = 'candidate';

function switchAuthMethod(method) {
    authMethod = method;
    const form = document.getElementById('loginForm');
    form.style.opacity = '0';
    setTimeout(() => {
        method === 'otp' ? renderOtpForm() : renderPasswordForm();
        form.style.opacity = '1';
    }, 200);
}

function togglePasswordVisibility() {
    const input = document.getElementById('loginPassword');
    const icon = document.querySelector('.password-toggle i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function renderPasswordForm() {
    const form = document.getElementById('loginForm');
    const isCand = userType === 'candidate';
    form.innerHTML = `
        <div class="form-step active" style="animation:none">
            <div class="form-group">
                <label>${isCand ? 'Mobile Number' : 'Work Email'} <span class="required">*</span></label>
                <div class="input-wrapper">
                    <i class="fas ${isCand ? 'fa-phone-alt' : 'fa-envelope'} input-icon"></i>
                    <input type="${isCand ? 'tel' : 'email'}" id="loginIdentifier" placeholder="${isCand ? 'Enter 10-digit mobile number' : 'Enter work email'}" required>
                </div>
            </div>
            <div class="form-group">
                <label>Password <span class="required">*</span></label>
                <div class="input-wrapper password-wrapper">
                    <i class="fas fa-lock input-icon"></i>
                    <input type="password" id="loginPassword" placeholder="Enter password" required>
                    <button type="button" class="password-toggle" onclick="togglePasswordVisibility()"><i class="fas fa-eye"></i></button>
                </div>
                <div class="forgot-pass"><a href="#">Forgot Password?</a></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Login</button>
            <div class="auth-method-toggle" style="margin-top: 16px; text-align: center;">
                <a onclick="switchAuthMethod('otp')">Login via OTP instead</a>
            </div>
            <div class="login-divider"><span>OR CONTINUE WITH</span></div>
            <button type="button" class="social-btn"><img src="https://www.google.com/favicon.ico" alt="Google"> Google</button>
        </div>`;

    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('loginIdentifier').value;
        const pass = document.getElementById('loginPassword').value;
        if (!id || !pass) return alert('Please fill in all fields');
        loginSuccess();
    };
}

function renderOtpForm() {
    const form = document.getElementById('loginForm');
    const isCand = userType === 'candidate';
    form.innerHTML = `
        <div class="form-step active" style="animation:none">
            <div class="form-group">
                <label>${isCand ? 'Mobile Number' : 'Work Email'} <span class="required">*</span></label>
                <div class="input-wrapper">
                    <i class="fas ${isCand ? 'fa-phone-alt' : 'fa-envelope'} input-icon"></i>
                    <input type="${isCand ? 'tel' : 'email'}" id="loginIdentifier" placeholder="${isCand ? 'Enter 10-digit mobile number' : 'Enter work email'}" required>
                </div>
            </div>
            
            <div id="otpSection" style="display:none">
                <div class="form-group">
                    <label>Enter OTP <span class="required">*</span></label>
                    <div class="otp-container">
                        ${Array(6).fill('<input type="text" class="otp-input" maxlength="1">').join('')}
                    </div>
                    <p class="helper-text" style="text-align: center; margin-top: 8px;">OTP sent to <span id="sentToDisplay" style="font-weight:700"></span></p>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="otpBtn">Send OTP</button>
            <div class="auth-method-toggle" style="margin-top: 16px; text-align: center;">
                <a onclick="switchAuthMethod('password')">Login via Password instead</a>
            </div>
        </div>`;

    const btn = document.getElementById('otpBtn');
    let step = 'send';

    // Setup OTP inputs
    setTimeout(() => {
        const inputs = document.querySelectorAll('.otp-input');
        inputs.forEach((inp, i) => {
            inp.addEventListener('input', e => {
                e.target.value = e.target.value.replace(/\D/g, '');
                if (e.target.value && i < 5) inputs[i + 1].focus();
            });
            inp.addEventListener('keydown', e => {
                if (e.key === 'Backspace' && !e.target.value && i > 0) inputs[i - 1].focus();
            });
        });
    }, 100);

    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('loginIdentifier').value;
        if (step === 'send') {
            if (!id) return alert('Please enter your details');
            btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            setTimeout(() => {
                btn.disabled = false; btn.innerText = 'Verify & Login';
                document.getElementById('otpSection').style.display = 'block';
                document.getElementById('sentToDisplay').innerText = id;
                document.querySelectorAll('.otp-input')[0].focus();
                step = 'verify';
            }, 1000);
        } else {
            const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
            if (otp.length < 6) return alert('Please enter valid 6-digit OTP');
            loginSuccess();
        }
    };
}

function loginSuccess() {
    const btn = document.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    setTimeout(() => {
        window.location.href = 'candidate-dashboard.html';
    }, 1500);
}
