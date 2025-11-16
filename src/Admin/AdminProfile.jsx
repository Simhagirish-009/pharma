
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function AdminProfile() {
  const [adminDetails, setAdminDetails] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
    imagePreview: null,
  });
  const [newPassword, setNewPassword] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [showImageEditIcon, setShowImageEditIcon] = useState(false);
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminDetails({ ...adminDetails, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('name', adminDetails.name);
    formData.append('email', adminDetails.email);
    if (newPassword) {
      formData.append('password', newPassword);
    }
    if (adminDetails.image) {
      formData.append('image', adminDetails.image);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/AdminProfile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.image;
      localStorage.setItem('AdminImage', imageUrl);
      localStorage.setItem('AdminName', adminDetails.name);
      localStorage.setItem('AdminEmail', adminDetails.email);

      setAdminDetails((prevDetails) => ({
        ...prevDetails,
        imagePreview: imageUrl,
      }));
      setNewPassword('');
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setError('Error updating profile. Please try again.');
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('AdminName');
    const email = localStorage.getItem('AdminEmail');
    const imageUrl = localStorage.getItem('AdminImage');

    if (name && email) {
      setAdminDetails((prevDetails) => ({
        ...prevDetails,
        name,
        email,
        imagePreview: imageUrl || null,
      }));
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          {adminDetails.imagePreview ? (
            <img
              src={adminDetails.imagePreview.startsWith('http') ? adminDetails.imagePreview : `http://127.0.0.1:8000${adminDetails.imagePreview}`}
              alt="Profile Preview"
              className="profile-image"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        <h2 className="profile-name">{adminDetails.name}</h2>
        <p className="profile-email">{adminDetails.email}</p>
        <form onSubmit={handleSubmit} className="profile-form">
          {isEditable && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="image" className="form-label">Upload Image:</label>
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="form-input"
              accept="image/*"
            />
          </div>

          <button type="submit" className="submit-button">Save Profile</button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default AdminProfile;
