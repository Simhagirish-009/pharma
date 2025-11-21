import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button,Modal } from "react-bootstrap";
import AddOrderUser from './AddOrderUser';
import DeliveryOrderUser from './DeliveryOrderUser';
import PendingUser from './PendingUser';
import PaymentUser from './PaymentUser';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import projectlog from '../Assets/images/projectlog.png';

const UserDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showDeliveryOrder, setShowDeliveryOrder] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [user, setUser] = useState({});
  const email = localStorage.getItem('email');
  const shop_name = localStorage.getItem('shop_name');
  const profileImage = localStorage.getItem('profile');
  const [showModal,setShowModal]=useState(false);

  const navigate = useNavigate();

  const handleAddOrderClick = () => {
    setShowAddOrder(true);
    navigate('/AddOrderUser');
  };

  const handleDeliveryOrderClick = () => {
    setShowDeliveryOrder(true);
    navigate('/DeliveryOrderUser');
  };

  const handlePendingClick = () => {
    setShowPending(true);
    navigate('/PendingUser');
  };

  const handlePaymentClick = () => {
    setShowPayment(true);
    navigate('/PaymentUser');
  };

  const handleProfile = () => {
    navigate('/UserProfile', { state: { user } });
  };

  const handleLogout = () => {
    navigate('/AdminUserLogin');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('Access_Token');
    axios.get('http://127.0.0.1:8000/api/getuser', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.log(error);
      });

    // Prevent back navigation
    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.href);
    };

    // Initial call to prevent back navigation
    preventBackNavigation();

    // Add event listener for popstate to prevent back navigation
    window.addEventListener('popstate', preventBackNavigation);

    // Maintain the state when navigating away
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-section')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listeners
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
      document.removeEventListener('click', handleClickOutside);
    };
  
  }, [dropdownOpen]);
  const handleLogoutClick = () => {
    setShowModal(true);
};

const handleConfirmLogout = () => {
    setShowModal(false);
    localStorage.removeItem("Access_Token");
    localStorage.removeItem("Refresh_Token");
    navigate('/');
};

  const handleCancelLogout = () => {
    setShowModal(false);
};
  
  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">
            <img src={projectlog} alt="Logo" className="logo-image" />
          </div>
          <ul className="navbar-menu">
            <li onClick={handleAddOrderClick}><i className="bi bi-plus-circle"></i> Add Order</li>
            <li onClick={handleDeliveryOrderClick}><i className="bi bi-truck"></i> Delivery Orders</li>
            <li onClick={handlePendingClick}><i className="bi bi-clock-history"></i> Pending Orders</li>
            <li onClick={handlePaymentClick}><i className="bi bi-credit-card"></i> Payment Status</li>
            <li onClick={handleLogoutClick}><i className="bi bi-box-arrow-right"></i> Logout</li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="profile-section" onClick={toggleDropdown}>
            {user ? (
              <img src={`${user.profileimage}`} alt="Profile" className="profile-avatar" />
            ) : (
              <i className="bi bi-person-circle profile-avatar"></i>
            )}
          </div>

          {dropdownOpen && (
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <div className="profile-details">
                {user ? (
                  <img src={`${user.profileimage}`} alt={shop_name} className="profile-image" />
                ) : (
                  <i className="bi bi-person-circle profile-avatar fs-1"></i>
                )}
                <div className="profile-info">
                  <h4>{user.shop_name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>

              <ul className="dropdown-list">
                <li onClick={handleProfile}><i className="bi bi-person"></i> Profile</li>
                <li onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Logout</li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <Modal show={showModal} onHide={handleCancelLogout}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelLogout}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmLogout}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
      {showAddOrder && <AddOrderUser onClose={() => setShowAddOrder(false)} />}
    </div>
  );
};

export default UserDashboard;
