// Initialize form
document.addEventListener('DOMContentLoaded', function () {
    initProgressSteps();
    initFormSteps();
    initOtpHandlers();
    initStep2Handlers();
    initStep3Handlers();
});

let currentStep = 1, phoneNumber = '', skills = [], isExperienced = true, resumeFile = null, profilePicFile = null;

function initProgressSteps() {
    const container = document.getElementById('progressSteps');
    container.innerHTML = `
    <div class="progress-step active" data-step="1"><div class="progress-step-indicator"><div class="progress-step-number">1</div><div class="progress-step-line"></div></div><div class="progress-step-content"><div class="progress-step-title">Primary Identity</div><div class="progress-step-desc">Mobile, Email & Location</div></div></div>
    <div class="progress-step" data-step="2"><div class="progress-step-indicator"><div class="progress-step-number">2</div><div class="progress-step-line"></div></div><div class="progress-step-content"><div class="progress-step-title">Professional Info</div><div class="progress-step-desc">Experience, Skills & Resume</div></div></div>
    <div class="progress-step" data-step="3"><div class="progress-step-indicator"><div class="progress-step-number">3</div><div class="progress-step-line"></div></div><div class="progress-step-content"><div class="progress-step-title">Education & Preferences</div><div class="progress-step-desc">Qualifications & Salary</div></div></div>`;
}

function initFormSteps() {
    const form = document.getElementById('signupForm');
    form.innerHTML = getStep1HTML() + getStep2HTML() + getStep3HTML() + getSuccessHTML();
}

function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelectorAll('.progress-step').forEach((ps, i) => {
        ps.classList.remove('active', 'completed');
        if (i + 1 < step) ps.classList.add('completed');
        else if (i + 1 === step) ps.classList.add('active');
    });
    currentStep = step;
    document.querySelector('.signup-right').scrollTop = 0;
}

function getStep1HTML() {
    return `<div class="form-step active" data-step="1">
    <div class="form-header"><h1>Primary Identity</h1><p>Let's start with your basic information</p></div>
    <div class="form-section" id="mobileSection">
      <div class="form-group"><label>Mobile Number <span class="required">*</span></label>
        <div class="phone-input-group"><div class="country-code">+91</div><div class="input-wrapper no-icon"><input type="tel" id="phoneNumber" placeholder="Enter 10-digit mobile number" maxlength="10" required></div></div>
        <p class="helper-text">We'll send an OTP to verify your number</p>
        <div class="error-message" id="phoneError" style="display:none"><i class="fas fa-exclamation-circle"></i><span>Please enter a valid 10-digit mobile number</span></div>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="sendOtpBtn">Send OTP <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
    </div>
    <div class="form-section" id="otpSection" style="display:none">
      <div class="form-group"><label>Enter OTP</label>
        <div class="otp-container"><input type="text" class="otp-input" maxlength="1" data-index="0" inputmode="numeric"><input type="text" class="otp-input" maxlength="1" data-index="1" inputmode="numeric"><input type="text" class="otp-input" maxlength="1" data-index="2" inputmode="numeric"><input type="text" class="otp-input" maxlength="1" data-index="3" inputmode="numeric"><input type="text" class="otp-input" maxlength="1" data-index="4" inputmode="numeric"><input type="text" class="otp-input" maxlength="1" data-index="5" inputmode="numeric"></div>
        <div class="otp-info"><p>OTP sent to <span class="phone-display" id="phoneDisplay">+91 98765 43210</span></p>
          <div class="demo-otp-box"><p class="demo-label">Demo OTP (for testing)</p><div class="demo-otp-code">123456</div><button type="button" class="auto-fill-btn" id="autoFillOtp">Auto-fill OTP</button></div>
          <button type="button" class="resend-link" id="resendOtp" disabled><i class="fas fa-redo"></i> Resend OTP <span id="resendTimer">(30s)</span></button>
        </div>
        <div class="error-message" id="otpError" style="display:none"><i class="fas fa-exclamation-circle"></i><span>Invalid OTP. Please try again.</span></div>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="verifyOtpBtn">Verify OTP <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
    </div>
    <div class="form-section" id="detailsSection" style="display:none">
      <div class="form-row">
        <div class="form-group"><label>Full Name <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-user input-icon"></i><input type="text" id="fullName" placeholder="Enter your full name" required></div></div>
        <div class="form-group"><label>Email Address <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-envelope input-icon"></i><input type="email" id="email" placeholder="Enter your email" required></div></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>City <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-map-marker-alt input-icon"></i><select id="city" required><option value="" disabled selected>Select city</option><optgroup label="Tier 1"><option value="mumbai">Mumbai</option><option value="delhi">Delhi NCR</option><option value="bangalore">Bangalore</option><option value="hyderabad">Hyderabad</option><option value="chennai">Chennai</option><option value="kolkata">Kolkata</option><option value="pune">Pune</option></optgroup><optgroup label="Tier 2"><option value="ahmedabad">Ahmedabad</option><option value="jaipur">Jaipur</option><option value="lucknow">Lucknow</option><option value="chandigarh">Chandigarh</option><option value="indore">Indore</option><option value="surat">Surat</option></optgroup><option value="other">Other</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div>
        <div class="form-group"><label>State <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-map input-icon"></i><select id="state" required><option value="" disabled selected>Select state</option><option value="maharashtra">Maharashtra</option><option value="delhi">Delhi</option><option value="karnataka">Karnataka</option><option value="telangana">Telangana</option><option value="tamil-nadu">Tamil Nadu</option><option value="west-bengal">West Bengal</option><option value="gujarat">Gujarat</option><option value="rajasthan">Rajasthan</option><option value="uttar-pradesh">Uttar Pradesh</option><option value="other">Other</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div>
      </div>
      <div class="form-group"><label>Create Password <span class="required">*</span></label><div class="input-wrapper password-wrapper"><i class="fas fa-lock input-icon"></i><input type="password" id="password" placeholder="Create a strong password" minlength="6" required><button type="button" class="password-toggle" id="togglePassword"><i class="fas fa-eye"></i></button></div><p class="helper-text">Minimum 6 characters</p></div>
      <div class="checkbox-group"><input type="checkbox" id="termsCheck" required><label for="termsCheck">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label></div>
      <div class="form-actions"><button type="button" class="btn btn-primary btn-block" id="step1NextBtn">Continue to Professional Info <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button></div>
    </div>
  </div>`;
}

function getStep2HTML() {
    return `<div class="form-step" data-step="2">
    <div class="form-header"><h1>Professional Information</h1><p>Tell us about your work experience and skills</p></div>
    <div class="form-group"><label>Work Status <span class="required">*</span></label><div class="toggle-group"><button type="button" class="toggle-option active" data-value="experienced">Experienced</button><button type="button" class="toggle-option" data-value="fresher">Fresher</button></div></div>
    <div id="experienceSection">
      <div class="form-row"><div class="form-group"><label>Total Experience <span class="required">*</span></label><div class="form-row" style="margin-top:6px"><div class="input-wrapper select-wrapper no-icon"><select id="expYears"><option value="" disabled selected>Years</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6+</option></select><i class="fas fa-chevron-down select-arrow"></i></div><div class="input-wrapper select-wrapper no-icon"><select id="expMonths"><option value="" disabled selected>Months</option><option value="0">0</option><option value="3">3</option><option value="6">6</option><option value="9">9</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div></div></div>
      <div class="form-row"><div class="form-group"><label>Job Title <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-briefcase input-icon"></i><input type="text" id="jobTitle" placeholder="e.g., Sales Executive"></div></div><div class="form-group"><label>Company <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-building input-icon"></i><input type="text" id="company" placeholder="e.g., Flipkart"></div></div></div>
    </div>
    <div class="form-group"><label>Key Skills <span class="required">*</span> <span class="optional">(5-10 recommended)</span></label><div class="skills-input-container" id="skillsContainer"><div class="skills-tags" id="skillsTags"></div><input type="text" class="skills-input" id="skillsInput" placeholder="Type a skill and press Enter..."></div><p class="skills-counter"><span id="skillsCount">0</span>/10 skills</p><div class="skills-suggestions"><button type="button" class="skill-suggestion" data-skill="Sales">+ Sales</button><button type="button" class="skill-suggestion" data-skill="Customer Service">+ Customer Service</button><button type="button" class="skill-suggestion" data-skill="Communication">+ Communication</button><button type="button" class="skill-suggestion" data-skill="MS Excel">+ MS Excel</button><button type="button" class="skill-suggestion" data-skill="Driving">+ Driving</button></div></div>
    <div class="form-group"><label>Upload Resume <span class="required">*</span></label><div class="file-upload-area" id="resumeUploadArea"><div class="file-upload-icon"><i class="fas fa-cloud-upload-alt"></i></div><p class="file-upload-text"><span>Click to upload</span> or drag and drop</p><p class="file-upload-hint">PDF or DOCX (Max 5MB)</p><input type="file" class="file-upload-input" id="resumeInput" accept=".pdf,.doc,.docx"></div><div class="uploaded-file" id="uploadedResume" style="display:none"><div class="uploaded-file-icon"><i class="fas fa-file-pdf"></i></div><div class="uploaded-file-info"><div class="uploaded-file-name" id="resumeFileName">resume.pdf</div><div class="uploaded-file-size" id="resumeFileSize">245 KB</div></div><button type="button" class="uploaded-file-remove" id="removeResume"><i class="fas fa-times"></i></button></div></div>
    <div class="form-group"><label>Profile Picture <span class="optional">(Optional)</span></label><div class="profile-pic-upload"><div class="profile-pic-preview" id="profilePicPreview"><i class="fas fa-user"></i></div><div class="profile-pic-actions"><button type="button" class="profile-pic-btn" id="uploadProfilePicBtn">Upload Photo</button><p class="helper-text">JPG/PNG (Max 2MB)</p></div><input type="file" id="profilePicInput" accept="image/*" style="display:none"></div></div>
    <div class="form-actions"><button type="button" class="btn btn-secondary" id="step2BackBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><button type="button" class="btn btn-primary" id="step2NextBtn">Continue to Education <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button></div>
  </div>`;
}

function getStep3HTML() {
    return `<div class="form-step" data-step="3">
    <div class="form-header"><h1>Education & Preferences</h1><p>Final step - qualifications and job preferences</p></div>
    <div class="form-section-title">Educational Qualifications</div>
    <div class="form-row"><div class="form-group"><label>Highest Qualification <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-graduation-cap input-icon"></i><select id="qualification" required><option value="" disabled selected>Select</option><option value="10th">10th</option><option value="12th">12th</option><option value="diploma">Diploma</option><option value="graduate">Graduation</option><option value="post-graduate">Post Graduation</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div><div class="form-group"><label>Course/Degree <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-book input-icon"></i><select id="course" required><option value="" disabled selected>Select</option><option value="btech">B.Tech</option><option value="bcom">B.Com</option><option value="bba">BBA</option><option value="bca">BCA</option><option value="mba">MBA</option><option value="iti">ITI</option><option value="other">Other</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div></div>
    <div class="form-row"><div class="form-group"><label>Specialization <span class="optional">(Optional)</span></label><div class="input-wrapper"><i class="fas fa-award input-icon"></i><input type="text" id="specialization" placeholder="e.g., Computer Science"></div></div><div class="form-group"><label>College/University <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-university input-icon"></i><input type="text" id="college" placeholder="Institution name" required></div></div></div>
    <div class="form-group" style="max-width:200px"><label>Passing Year <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-calendar input-icon"></i><select id="passingYear" required><option value="" disabled selected>Year</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option><option value="2020">2020</option><option value="2019">2019 or earlier</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div>
    <div class="form-section-title" style="margin-top:24px">Salary & Preferences</div>
    <div class="form-row" id="salarySection"><div class="form-group"><label>Current Salary (CTC) <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-rupee-sign input-icon"></i><input type="text" id="currentSalary" placeholder="e.g., 3,00,000"></div><p class="helper-text">Per annum</p></div><div class="form-group"><label>Expected Salary <span class="required">*</span></label><div class="input-wrapper"><i class="fas fa-rupee-sign input-icon"></i><input type="text" id="expectedSalary" placeholder="e.g., 4,50,000"></div></div></div>
    <div class="form-row"><div class="form-group"><label>Notice Period <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-clock input-icon"></i><select id="noticePeriod" required><option value="" disabled selected>Select</option><option value="immediate">Immediate</option><option value="15-days">15 Days</option><option value="30-days">1 Month</option><option value="60-days">2 Months</option><option value="90-days">3 Months</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div><div class="form-group"><label>Work Type <span class="required">*</span></label><div class="input-wrapper select-wrapper"><i class="fas fa-laptop-house input-icon"></i><select id="workType" required><option value="" disabled selected>Select</option><option value="onsite">On-site</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="field">Field Work</option><option value="any">Any</option></select><i class="fas fa-chevron-down select-arrow"></i></div></div></div>
    <div class="form-actions"><button type="button" class="btn btn-secondary" id="step3BackBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><button type="submit" class="btn btn-primary" id="createAccountBtn">Create My Profile <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></button></div>
  </div>`;
}

function getSuccessHTML() {
    return `<div class="success-state" id="successState"><div class="success-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><h2>Profile Created Successfully!</h2><p>Your profile is now live. Start exploring jobs.</p><button type="button" class="btn btn-primary" onclick="window.location.href='rightjobs-premium.html'">Browse Jobs <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button></div>`;
}

function initOtpHandlers() {
    const phoneInput = document.getElementById('phoneNumber');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const otpInputs = document.querySelectorAll('.otp-input');

    phoneInput.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10); document.getElementById('phoneError').style.display = 'none'; });

    sendOtpBtn.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        if (!/^[6-9]\d{9}$/.test(phone)) { document.getElementById('phoneError').style.display = 'flex'; return; }
        phoneNumber = phone;
        sendOtpBtn.disabled = true; sendOtpBtn.innerHTML = '<div class="spinner"></div> Sending...';
        setTimeout(() => {
            sendOtpBtn.disabled = false; sendOtpBtn.innerHTML = 'Send OTP <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            document.getElementById('phoneDisplay').textContent = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
            document.getElementById('mobileSection').style.display = 'none';
            document.getElementById('otpSection').style.display = 'block';
            startResendTimer(); otpInputs[0].focus();
        }, 1500);
    });

    otpInputs.forEach((input, i) => {
        input.addEventListener('input', e => { const v = e.target.value.replace(/\D/g, ''); e.target.value = v; if (v) { e.target.classList.add('filled'); if (i < 5) otpInputs[i + 1].focus(); } else e.target.classList.remove('filled'); document.getElementById('otpError').style.display = 'none'; });
        input.addEventListener('keydown', e => { if (e.key === 'Backspace' && !e.target.value && i > 0) otpInputs[i - 1].focus(); });
    });

    document.getElementById('autoFillOtp').addEventListener('click', () => { '123456'.split('').forEach((c, i) => { otpInputs[i].value = c; otpInputs[i].classList.add('filled'); }); otpInputs[5].focus(); });

    verifyOtpBtn.addEventListener('click', () => {
        const otp = Array.from(otpInputs).map(i => i.value).join('');
        if (otp.length !== 6) { document.getElementById('otpError').style.display = 'flex'; return; }
        verifyOtpBtn.disabled = true; verifyOtpBtn.innerHTML = '<div class="spinner"></div> Verifying...';
        setTimeout(() => {
            verifyOtpBtn.disabled = false; verifyOtpBtn.innerHTML = 'Verify OTP <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            if (otp === '000000') { document.getElementById('otpError').style.display = 'flex'; return; }
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('detailsSection').style.display = 'block';
            document.getElementById('fullName').focus();
        }, 1500);
    });

    document.getElementById('resendOtp').addEventListener('click', () => { otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); }); otpInputs[0].focus(); startResendTimer(); });
    document.getElementById('togglePassword').addEventListener('click', () => { const p = document.getElementById('password'); p.type = p.type === 'password' ? 'text' : 'password'; document.querySelector('#togglePassword i').classList.toggle('fa-eye'); document.querySelector('#togglePassword i').classList.toggle('fa-eye-slash'); });
    document.getElementById('step1NextBtn').addEventListener('click', () => { if (!document.getElementById('fullName').value.trim() || !document.getElementById('email').value.trim() || !document.getElementById('city').value || !document.getElementById('state').value || !document.getElementById('password').value || !document.getElementById('termsCheck').checked) { alert('Please fill all required fields'); return; } goToStep(2); });
}

let resendTimerInterval;
function startResendTimer() {
    let s = 30; const timer = document.getElementById('resendTimer'), btn = document.getElementById('resendOtp'); btn.disabled = true;
    resendTimerInterval = setInterval(() => { s--; timer.textContent = `(${s}s)`; if (s <= 0) { clearInterval(resendTimerInterval); timer.textContent = ''; btn.disabled = false; } }, 1000);
}

function initStep2Handlers() {
    document.querySelectorAll('.toggle-option').forEach(o => o.addEventListener('click', () => {
        document.querySelectorAll('.toggle-option').forEach(x => x.classList.remove('active')); o.classList.add('active');
        isExperienced = o.dataset.value === 'experienced';
        document.getElementById('experienceSection').style.display = isExperienced ? 'block' : 'none';
        document.getElementById('salarySection').style.display = isExperienced ? 'grid' : 'none';
    }));

    const skillsInput = document.getElementById('skillsInput');
    skillsInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillsInput.value); skillsInput.value = ''; } });
    document.querySelectorAll('.skill-suggestion').forEach(b => b.addEventListener('click', () => addSkill(b.dataset.skill)));

    const resumeArea = document.getElementById('resumeUploadArea'), resumeInput = document.getElementById('resumeInput');
    resumeArea.addEventListener('click', () => resumeInput.click());
    resumeArea.addEventListener('dragover', e => { e.preventDefault(); resumeArea.classList.add('dragover'); });
    resumeArea.addEventListener('dragleave', () => resumeArea.classList.remove('dragover'));
    resumeArea.addEventListener('drop', e => { e.preventDefault(); resumeArea.classList.remove('dragover'); handleResume(e.dataTransfer.files[0]); });
    resumeInput.addEventListener('change', e => handleResume(e.target.files[0]));
    document.getElementById('removeResume').addEventListener('click', () => { resumeFile = null; resumeArea.classList.remove('has-file'); document.getElementById('uploadedResume').style.display = 'none'; resumeInput.value = ''; });

    document.getElementById('uploadProfilePicBtn').addEventListener('click', () => document.getElementById('profilePicInput').click());
    document.getElementById('profilePicInput').addEventListener('change', e => { const f = e.target.files[0]; if (f && f.type.startsWith('image/') && f.size <= 2 * 1024 * 1024) { profilePicFile = f; const r = new FileReader(); r.onload = ev => document.getElementById('profilePicPreview').innerHTML = `<img src="${ev.target.result}" alt="Profile">`; r.readAsDataURL(f); } });

    document.getElementById('step2BackBtn').addEventListener('click', () => goToStep(1));
    document.getElementById('step2NextBtn').addEventListener('click', () => { if (skills.length < 1) { alert('Add at least one skill'); return; } if (!resumeFile) { alert('Upload your resume'); return; } if (isExperienced && (!document.getElementById('jobTitle').value.trim() || !document.getElementById('company').value.trim())) { alert('Fill job details'); return; } goToStep(3); });
}

function addSkill(s) { s = s.trim(); if (!s || skills.includes(s) || skills.length >= 10) return; skills.push(s); renderSkills(); }
function removeSkill(s) { skills = skills.filter(x => x !== s); renderSkills(); }
function renderSkills() { document.getElementById('skillsTags').innerHTML = skills.map(s => `<span class="skill-tag">${s}<button type="button" onclick="removeSkill('${s}')">&times;</button></span>`).join(''); document.getElementById('skillsCount').textContent = skills.length; }
function handleResume(f) { if (!f) return; const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; if (!valid.includes(f.type) || f.size > 5 * 1024 * 1024) { alert('Invalid file'); return; } resumeFile = f; document.getElementById('resumeUploadArea').classList.add('has-file'); document.getElementById('resumeFileName').textContent = f.name; document.getElementById('resumeFileSize').textContent = (f.size / 1024).toFixed(0) + ' KB'; document.getElementById('uploadedResume').style.display = 'flex'; }

function initStep3Handlers() {
    ['currentSalary', 'expectedSalary'].forEach(id => document.getElementById(id).addEventListener('input', e => { let v = e.target.value.replace(/\D/g, ''); if (v) v = parseInt(v).toLocaleString('en-IN'); e.target.value = v; }));

    document.getElementById('step3BackBtn').addEventListener('click', () => goToStep(2));
    document.getElementById('signupForm').addEventListener('submit', e => {
        e.preventDefault();
        if (!document.getElementById('qualification').value || !document.getElementById('course').value || !document.getElementById('college').value.trim() || !document.getElementById('passingYear').value || !document.getElementById('noticePeriod').value || !document.getElementById('workType').value) { alert('Fill all required fields'); return; }
        if (isExperienced && (!document.getElementById('currentSalary').value || !document.getElementById('expectedSalary').value)) { alert('Fill salary details'); return; }
        const btn = document.getElementById('createAccountBtn'); btn.disabled = true; btn.innerHTML = '<div class="spinner"></div> Creating...';
        setTimeout(() => {
            btn.disabled = false; btn.innerHTML = 'Create My Profile <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
            document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.progress-step').forEach(s => s.classList.add('completed'));
            document.getElementById('successState').classList.add('active');
        }, 2000);
    });
}

document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.lang-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); }));
