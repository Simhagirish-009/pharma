
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table, Form, InputGroup, FormControl } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const AddOrderUser = () => {
  const [medicines, setMedicines] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    count: "",
    type: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [price, setPrice] = useState(0); // State to hold the price of the selected medicine

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // When type changes, reset dropdown search term and price
    if (name === "type") {
      setDropdownSearchTerm("");
      setFilteredMedicines([]);
      setPrice(0); // Reset price when type changes
    }

    // Calculate total amount when count changes
    if (name === "count") {
      const totalAmount = price * value; // Calculate total based on price and count
      setFormData((prevState) => ({
        ...prevState,
        totalAmount: totalAmount,
      }));
    }
  };

  const handleDropdownSearch = (e) => {
    const value = e.target.value;
    setDropdownSearchTerm(value);

    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMedicines(filtered);
  };

  const handleAddOrder = async () => {
    if (!formData.name || !formData.count || !formData.type) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const orderPayload = {
      drug_name: formData.type === "Drug" ? formData.name : null,
      medicine_name: formData.type === "Medicine" ? formData.name : null,
      count: formData.count,
      total_amount: formData.totalAmount || 0, // Send total amount in the payload
    };

    const selectedMedicine = medicines.find((medicine) => medicine.name === formData.name);
    const availableCount = selectedMedicine ? selectedMedicine.count : 0;

    if (parseInt(formData.count) > availableCount) {
      alert(`Count exceeds available count. Available count is ${availableCount}.`);
      return;
    }

    try {
      const token = localStorage.getItem("Access_Token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/addorders/",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setOrderData([...orderData, response.data]);
      toast.success("Order added successfully!...");
      resetForm();
      setOrderData([...orderData, {
        drug_name:orderPayload.drug_name, 
        medicine_name:orderPayload.medicine_name, 
        count:orderPayload.count}])
      setShowModal(false);
    } catch (error) {
      console.error("Error adding the order: ", error.response?.data || error);
      toast.error("An error occurred while adding the order.");
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  const filteredOrders = orderData.filter((order) =>
    (order.drug_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (order.medicine_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      count: "",
      type: "",
    });
    setDropdownSearchTerm("");
    setFilteredMedicines([]);
    setPrice(0); // Reset price when form is reset
  };

  const handleDeleteOrder = async (index) => {
    try {
      const token = localStorage.getItem("Access_Token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/manage_order/${orderData[index].id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderData(orderData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting the order: ", error.response?.data || error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("Access_Token");
        if (!token) {
          toast.error("Authorization token is missing.");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching orders: ", error.response?.data || error);
      }
    };

    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/medicines/");
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching medicines: ", error.response?.data || error);
      }
    };

    fetchOrders();
    fetchMedicines();
  }, []);

  return (
    <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className="d-flex">
        <div className="col-lg-2 col-md-4 col-sm-12">
          <UserDashboard />
        </div>
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="shop-container P-4">
            <h2 className="heading">Add Orders</h2>
            <Button
              onClick={() => {
                setShowModal(true);
                resetForm();
              }}
              className="btn-sm"
              style={{
                backgroundColor: "#015d67",
                color: "#fff",
                border: "none",
                padding: "13px 20px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
                width: "10%",
                marginTop: "4%",
              }}
            >
              Add Order
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Add Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Drug">Drug</option>
                      <option value="Medicine">Medicine</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{formData.type === "Drug" ? "Drug Name" : "Medicine Name"}</Form.Label>
                    <InputGroup>
                      <FormControl
                        placeholder={`Search ${formData.type}`}
                        value={dropdownSearchTerm}
                        onChange={handleDropdownSearch}
                      />
                    </InputGroup>

                    {/* Suggestions for medicines */}
                    {dropdownSearchTerm && filteredMedicines.length > 0 && (
                      <ul className="list-group" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {filteredMedicines
                          .filter((medicine) => medicine.type === formData.type)
                          .map((medicine) => (
                            <li
                              key={medicine.id}
                              className="list-group-item"
                              onClick={() => {
                                setFormData({ ...formData, name: medicine.name });
                                setPrice(medicine.price); // Set the price when a medicine is selected
                                setDropdownSearchTerm(medicine.name); // Set input to selected medicine
                                setFilteredMedicines([]); // Clear suggestions
                              }}
                            >
                              {medicine.name} (Count: {medicine.count}) (Price: {medicine.price})
                            </li>
                          ))}
                      </ul>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Count(per sheet 10 tablets)</Form.Label>
                    <Form.Control
                      type="number"
                      name="count"
                      value={formData.count}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="totalAmount"
                      value={formData.totalAmount || ""}
                      readOnly
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleAddOrder}
                    style={{
                      backgroundColor: "#015d67",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease",
                      marginTop: "10px",
                    }}
                  >
                    Add Order
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            <div className="input-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search Orders..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: "50px", width: "300px", padding: "8px" }}
              />
            </div>
            <Table className="table mt-3" striped bordered hover>
              <thead>
                <tr>
                  <th>Drug Name</th>
                  <th>Medicine Name</th>
                  <th>Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.drug_name}</td>
                    <td>{order.medicine_name}</td>
                    <td>{order.count}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteOrder(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOrderUser;


