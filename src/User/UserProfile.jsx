import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function UserProfile() {
  const [userDetails, setUserDetails] = useState({
    shop_name: '',
    email: '',
    image: null,
    imagePreview: null,
  });
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const user = location.state?.user || {};  // Fallback to empty object if no user data passed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails({ ...userDetails, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('shop_name', userDetails.shop_name);
    formData.append('email', userDetails.email);
    if (userDetails.image) {
        formData.append('image', userDetails.image);
    }

    try {
        const response = await axios.put('http://localhost:8000/api/update_profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const imageUrl = response.data.image;  // Ensure this is part of the returned data
        localStorage.setItem('profile', imageUrl);
        localStorage.setItem('shop_name', userDetails.shop_name);
        localStorage.setItem('email', userDetails.email);

        setUserDetails((prevDetails) => ({
            ...prevDetails,
            imagePreview: imageUrl || prevDetails.imagePreview,
        }));
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        setError('Error updating profile. Please try again.');
    }
};

// Image rendering
<img
    src={userDetails.imagePreview || 'path/to/default/image.jpg'}
    alt={userDetails.shop_name}
    className="profile-image"
/>


  useEffect(() => {
    const shop_name = user?.shop_name || localStorage.getItem('shop_name');
    const email = user?.email || localStorage.getItem('email');
    const imageUrl = localStorage.getItem('profile');
    
    if (shop_name && email) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        shop_name,
        email,
        imagePreview: imageUrl || null,
      }));
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          {userDetails.imagePreview ? (
            <img
              src={`${user.profileimage}`}
              alt={userDetails.shop_name}
              className="profile-image"
            />
          ) : (
            <div className="placeholder-image">No Image</div>
          )}
        </div>
          <h2>{userDetails.shop_name}</h2>
         <p> {userDetails.email}</p>
          <div className="form-group">
            <button type="submit" className="submit-button">Save</button>
          </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default UserProfile;
