
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Button,Modal } from "react-bootstrap";
import projectlog from '../assets/images/projectlog.png';
// Import AddShopAdmin and AddMedAdmin components
import AddShopAdmin from "./AddShopAdmin"; // Ensure the correct path
import AddMedAdmin from "./AddMedAdmin";   // Ensure the correct path

const AdminDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false); // State for Add Medicine Modal
  const [showAddShop, setShowAddShop] = useState(false); // State for Add Shop Modal
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminImage, setAdminImage] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0); // State for pending orders count
  const [showModal,setShowModal]=useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleAddMedicinesClick = () => {
    setShowAddMedModal(true);
    navigate('/AddMedAdmin');
  };

  const handleAddShopClick = () => {
    setShowAddShop(true); // Show the Add Shop modal
    navigate('/AddShopAdmin');
  };

  const handleLogout = () => {
    navigate('/AdminUserLogin');
  };

  const handleProfile = () => {
    navigate('/AdminProfile');
  };

  const handleDeliveryOrdersClick = () => {
    navigate('/DeliveryOrderAdmin');
  };

  const handlePendingOrdersClick = () => {
    navigate('/PendingAdmin');
  };

  const closeAddShop = () => {
    setShowAddShop(false); // Correctly close the Add Shop modal
  };

  const fetchPendingOrdersCount = () => {
    axios
      .get("http://127.0.0.1:8000/api/pending-orders-count/") // API to get pending orders count
      .then((response) => {
        setPendingOrdersCount(response.data.count); // Assuming the API returns { count: number }
      })
      .catch((error) => {
        console.error("Error fetching pending orders count:", error);
      });
  };

  useEffect(() => {
    setAdminName(localStorage.getItem('AdminName') || 'Admin');
    setAdminEmail(localStorage.getItem('AdminEmail') || 'admin@example.com');
    setAdminImage(localStorage.getItem('AdminImage'));
    fetchPendingOrdersCount();
    
    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.href)
  }

  window.history.pushState(null, null, window.location.href);
  window.addEventListener('popstate', preventBackNavigation);

  return () => {
      window.removeEventListener('popstate', preventBackNavigation);
  };

    const intervalId = setInterval(fetchPendingOrdersCount, 5000);
  
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-section')) {
        setDropdownOpen(false);
      }
    };
 
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearInterval(intervalId); 
    };
  }, []);

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
            <li onClick={handleAddMedicinesClick}>
              <i className="bi bi-plus-circle"></i> Add Medicines
            </li>
            <li onClick={handleAddShopClick}>
              <i className="bi bi-shop"></i> Add Users
            </li>
            <li onClick={handleDeliveryOrdersClick}>
              <i className="bi bi-truck"></i> Delivery Orders
            </li>
            <li onClick={handlePendingOrdersClick}>
              <i className="bi bi-clock"></i> Pending Orders
              {pendingOrdersCount > 0 && (
                <span className="badge bg-danger">{pendingOrdersCount}</span>
              )}
            </li>
            <li onClick={handleLogoutClick}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="profile-section" onClick={toggleDropdown}>
            {adminImage ? (
              <img src={`http://127.0.0.1:8000${adminImage}`} alt="Profile" className="profile-avatar" />
            ) : (
              <i className="bi bi-person-circle profile-avatar fs-1"></i> // Default admin icon
            )}
          </div>

          {dropdownOpen && (
            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              <div className="profile-details">
                {adminImage ? (
                  <img src={`http://127.0.0.1:8000${adminImage}`} alt="Profile" className="profile-avatar" />
                ) : (
                  <i className="bi bi-person-circle profile-avatar fs-1"></i> // Default admin icon
                )}
                <div className="profile-info">
                  <h4>{adminName}</h4>
                  <p>{adminEmail}</p>
                </div>
              </div>
              <ul className="dropdown-list">
                <li onClick={handleProfile}>
                  <i className="bi bi-person"></i> Profile
                </li>
                <li onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </li>
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

      {showAddShop && (
        <AddShopAdmin onClose={closeAddShop} />
      )}

      {showAddMedModal && (
        <AddMedAdmin onClose={() => setShowAddMedModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;

