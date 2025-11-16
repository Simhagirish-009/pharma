import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/send_otp/', { email });
      if (response.status === 200) {
        setSuccess('OTP sent to your email');
        setStep(2);
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify/', { email, otp_code:otp });
      if (response.status === 200) {
        setSuccess('OTP verified successfully');
        setStep(3);
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/restpassword/', { email, password:newPassword });
      if (response.status === 200) {
        setSuccess('Password reset successfully');
        setStep(1);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError('Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="page-background">
      <div className="resetpasswordcontainer">
        <h1 style={{ fontSize: '24px', color: '#015d67', marginBottom: '20px', textAlign: 'center' }}>
          Reset Your Password
        </h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="label">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="button">Get OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp" className="label">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="button">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword" className="label">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="label">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="button">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;