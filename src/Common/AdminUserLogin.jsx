
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button,Modal,Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';  // Import toast components
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles

function AdminUserLogin() {
  const [activeTab, setActiveTab] = useState('loginTab');
  const [animating, setAnimating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // State for spinner
   const [showModal, setShowModal] = useState(false);
    const [shopData, setShopData] = useState([]); // List of shops
    const [formData, setFormData] = useState({
      shopName: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null, // Add profileImage to form data
    });
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === activeTab || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] }); // Update with selected file
  };



  const handleAddShop = async (e) => {
    e.preventDefault();

    const newShop = new FormData();
    newShop.append("shopName", formData.shopName.toLowerCase());
    newShop.append("address", formData.address);
    newShop.append("email", formData.email);
    newShop.append("password", formData.password);

    if (formData.profileImage) {
      newShop.append("profileImage", formData.profileImage);
    } else {
      toast.error("Profile image is required");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/shop/", newShop, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setShopData([...shopData, {
          shop_name:formData.shopName,
          address:formData.address,
          email:formData.email
        }]);
        toast.success("Shop added successfully");
        setFormData({
          shopName: "",
          address: "",
          email: "",
          password: "",
          confirmPassword: "",
          profileImage: null,
        });
        setShowModal(false);
      }
    } catch (error) {
      if (error.response && error.response.data.error === 'A user with this email already exists') {
        toast.error("A user with this email already exists.");
      } else {
        toast.error("Error occurred while adding the shop.");
      }
    }
  };




  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Show spinner when loading starts
    try {
      let response;
      const loginData = { email, password };

      if (activeTab === 'loginTab') {
        // Admin login
        response = await axios.post('http://127.0.0.1:8000/api/admin-login/', loginData);
        localStorage.setItem('Access_Token', response.data.access);
        localStorage.setItem('Refresh_Token', response.data.refresh);
        localStorage.setItem('AdminLogin', true);
        localStorage.setItem('AdminName', response.data.name);
        localStorage.setItem('AdminEmail', response.data.email);
      } else if (activeTab === 'registerTab') {
        // User login
        response = await axios.post('http://127.0.0.1:8000/api/user-login/', loginData);
        localStorage.setItem('Access_Token', response.data.access);
        localStorage.setItem('Refresh_Token', response.data.refresh);
        localStorage.setItem('AdminLogin', false);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('profile', response.data.profile);
        localStorage.setItem('shop_name', response.data.shop_name);
      }

      // Show success toast message
      toast.success(response.data.message);

      navigate('/OTPUserAdmin', { state: { loginData } });
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : 'An error occurred';
      setError(errorMessage);
      // Show error toast message
      toast.error(errorMessage);
    } finally {
      setLoading(false);  // Hide spinner when loading finishes
    }
  };

  const handleForgotPassword = () => {
    navigate('/ResetPassword');
  };

  return (
    <div className="containers">
      <h1 className="heading">Welcome to PharmEase</h1>

      <div className="form-container">
        {loading ? (  // Show spinner if loading is true
          <div className="spinner"></div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <button
                onClick={() => handleTabClick('loginTab')}
                className={`tab-button ${activeTab === 'loginTab' ? 'active' : ''}`}
              >
                Admin
              </button>

              <button
                onClick={() => handleTabClick('registerTab')}
                className={`tab-button ${activeTab === 'registerTab' ? 'active' : ''}`}
              >
                User
              </button>
            </div>

            <div className={`fade-in-form ${animating ? 'fade-out' : ''}`}>
              {activeTab === 'loginTab' && (
                <div>
                  <h3 style={{ color: '#00acb1' }}>Admin Login</h3>
                  {error && <p className="error">{error}</p>}
                  <form onSubmit={handleLogin}>
                    <div className="input-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="forgot-password">
                      <a href="#!" onClick={handleForgotPassword}>Forgot password?</a>
                    </div>
                    <button type="submit" className="submit-button">
                      Login
                    </button>

                  </form>
                </div>
              )}     

              {activeTab === 'registerTab' && (
                <div>
                  <h3 style={{ color: '#00acb1' }}>User Login</h3>
                  {error && <p className="error">{error}</p>}
                  <form onSubmit={handleLogin}>
                    <div className="input-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <a href="#!" onClick={()=>setShowModal(true)}>register</a>

                    <button type="submit" className="submit-button">
                      Login
                    </button>

                  </form>
                </div>
              )}
            </div>
                 
            
                 
          </div>
        )}
      </div>
      <ToastContainer />  {/* Add toast container here */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title> Add User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAddShop}>
                  <Form.Group controlId="shopName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      placeholder="Enter User name"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="profileImage">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                    />
                  </Form.Group>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit"
                      style={{ backgroundColor: '#015d67' }}
                    >
                      Add User
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
    </div>
  );
}

export default AdminUserLogin;

