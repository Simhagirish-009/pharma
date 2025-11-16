import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OTPUserAdmin() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(() => {
    const storedTime = localStorage.getItem('otpTimer');
    const expiryTime = localStorage.getItem('otpExpiryTime');
    const currentTime = new Date().getTime();
    return expiryTime && currentTime < expiryTime ? Math.floor((expiryTime - currentTime) / 1000) : 30;
  });
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const navigate = useNavigate();
  
  const location = useLocation();
  const user = location.state?.loginData;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);

      // Store the current timer and expiration time in localStorage
      localStorage.setItem('otpTimer', timer);
      localStorage.setItem('otpExpiryTime', new Date().getTime() + timer * 1000);

      return () => clearTimeout(countdown);
    } else {
      // Clear the stored timer once it reaches zero
      localStorage.removeItem('otpTimer');
      localStorage.removeItem('otpExpiryTime');
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsOtpComplete(newOtp.every((digit) => digit !== ''));

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData('text').slice(0, 6); // Get the first 6 digits from the paste
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setIsOtpComplete(newOtp.every((digit) => digit !== ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    const is_admin = localStorage.getItem('AdminLogin');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify/', {
        otp_code: otpCode,
      });
      toast.success(response.data.message);
      if (is_admin === 'true') {
        navigate('/AddMedAdmin');
      } else {
        navigate('/AddOrderUser');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'An error occurred.');
    }
  };

  const resendOtp = async () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    setIsOtpComplete(false);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/send_otp/', {
        email: user.email,
      });
      toast.success(response.data.message);
      localStorage.setItem('otpTimer', 30);
      localStorage.setItem('otpExpiryTime', new Date().getTime() + 30 * 1000);
    } catch (error) {
      toast.error('Failed to resend OTP.');
    }
  };

  return (
    <div className="outerContainer">
      <div className="otpcontainer">
        <h1 className="title">OTP Verification</h1>
        <p className="instruction">Enter the 6-digit OTP sent to {user.email}:</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="otpBox">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}  // Add paste handler
                className="otpInput"
              />
            ))}
          </div>

          <div className="timerSection">
            <p className={timer > 0 ? 'timer' : 'timerExpired'}>
              {timer > 0
                ? `Resend OTP in 00:${timer < 10 ? `0${timer}` : timer}`
                : 'OTP expired!'}
            </p>
          </div>

          {timer === 0 ? (
            <button type="button" onClick={resendOtp} className="button resendButton">
              Resend OTP
            </button>
          ) : (
            isOtpComplete && (
              <button type="submit" className="button">
                Verify OTP
              </button>
            )
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default OTPUserAdmin;
