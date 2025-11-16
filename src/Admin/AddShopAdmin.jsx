import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table, Form, InputGroup, FormControl } from "react-bootstrap";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddShopAdmin = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentShopIndex, setCurrentShopIndex] = useState(null); // Store the current shop index for editing

  console.log(formData, "formData")
  const fetchShopData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get-shop/");
      setShopData(response.data);
    } catch (error) {
      console.error("Error fetching shop data:", error);
      toast.error("Error occurred while fetching shop data.");
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

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



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleEditShop = (index) => {
    console.log(index, "index")
    const shopToEdit = shopData[index];

    console.log(shopToEdit, "shopedit")
    setFormData({
      id: shopToEdit.id,
      shopName: shopToEdit.shop_name,
      address: shopToEdit.address,
      email: shopToEdit.email,
      password: "",
      confirmPassword: "",
      profileImage: null,
    });
    setCurrentShopIndex(index); // Set the current shop index
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault(); // Prevent default submission

    const updatedShop = new FormData();
    updatedShop.append("shopName", formData.shopName.toLowerCase());
    updatedShop.append("address", formData.address);
    updatedShop.append("email", formData.email);
    updatedShop.append("password", formData.password);

    // Only add profileImage if it's been selected for the update
    if (formData.profileImage) {
      updatedShop.append("profileImage", formData.profileImage);
    }

    if (currentShopIndex !== null) { // Check if the currentShopIndex is set
      const shopId = shopData[currentShopIndex].id; // Get the shop ID
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/shop/update/${shopId}/`, updatedShop, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success("Shop updated successfully");
          // Update shopData to reflect changes
          const updatedShopData = [...shopData];
          updatedShopData[currentShopIndex] = response.data; // Update the current shop with new data
          setShopData(updatedShopData);
          setShowModal(false); // Close the modal
          setIsEditing(false); // Reset editing state
          setCurrentShopIndex(null); // Reset current shop index
          setFormData({
            shopName: "",
            address: "",
            email: "",
            password: "",
            confirmPassword: "",
            profileImage: null,
          });
        }
      } catch (error) {
        console.error("Error occurred while updating the shop:", error);
        toast.error("Error occurred while updating the shop.");
      }
    } else {
      toast.error("No shop selected for updating.");
    }
  };


  const handleDeleteShop = async (index) => {
    const shopToDelete = shopData[index];

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/shop/delete/${shopToDelete.id}/`); // Ensure this is correct
      // Handle successful deletion (e.g., update state to remove the deleted shop)
      toast.success(`${shopToDelete.shop_name} has been deleted successfully.`);
    } catch (error) {
      console.error("Error occurred while deleting the shop:", error);
      toast.error("Error occurred while deleting the shop.");
    }
  };


  return (
    <>
      <ToastContainer />
      <div className="d-flex">
        <div className="col-lg-2 col-md-4 col-sm-12">
          <AdminDashboard />
        </div>
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="shop-container p-4">
            <h2 className="heading">Manage Users</h2>
            <Button
              onClick={() => setShowModal(true)}
              className="btn-sm"
              style={{
                backgroundColor: '#015d67',
                color: '#fff',
                border: 'none',
                padding: '13px 20px',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
                width: '10%',
                marginTop: '6%',
              }}
            >
              Add User
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Edit User" : "Add User"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={isEditing ? handleUpdateShop : handleAddShop}>
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
                      {isEditing ? "Update User" : "Add User"}
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Search bar */}
            <InputGroup className="my-3">
              <FormControl
                placeholder="Search Users"
                aria-label="Search Users"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>


            <div className="table-responsive" style={{ overflowY: "auto", maxHeight: "400px", width: "100%" }}>
              <div className="container-fluid" style={{ minWidth: "1000px" }}>
                <Table striped bordered hover className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "300px" }}>User Name</th>
                      <th style={{ width: "300px" }}>Address</th>
                      <th style={{ width: "200px" }}>Email</th>
                      <th style={{ width: "800px", textAlign: "center" }}>Actions</th>
                      <th style={{ width: "150px", textAlign: "center" }}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopData
                      .filter((shop) => shop.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((shop, index) => (
                        <tr key={shop.id}>
                          <td>{shop.shop_name}</td>
                          <td>{shop.address}</td>
                          <td>{shop.email}</td>
                          <td style={{ textAlign: "center" }}>
                            <Button variant="success" onClick={() => handleEditShop(index)} style={{ marginRight: "10px" }}>
                              Edit
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteShop(index)}>
                              Delete
                            </Button>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              variant="info"
                              onClick={() => window.open(
                                `https://www.google.com/maps?q=${encodeURIComponent(shop.address)}, ${encodeURIComponent(shop.city)}, ${encodeURIComponent(shop.postal_code)}`,
                                '_blank'
                              )}
                              style={{ marginLeft: "10px" }}
                            >
                              Location
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default AddShopAdmin;



