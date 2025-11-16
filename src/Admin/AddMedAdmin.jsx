import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table, Form, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const AddMedAdmin = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [medicineData, setMedicineData] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    count: "",
    manufacturing_date: "",
    expiry_date: "",
    price: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/medicines/";

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(API_URL);
      setMedicineData(response.data);
    } catch (error) {
      console.error("Error fetching medicine data", error);
      toast.error("Error fetching medicine data.");
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({ ...formData, type });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMedicine = async () => {
    try {
      const newMedicine = {
        ...formData,
        manufacturing_date: formData.manufacturing_date || new Date().toISOString().split("T")[0],
        expiry_date: formData.expiry_date || new Date().toISOString().split("T")[0],
      };

      // Ensure expiry date is valid
      if (!newMedicine.expiry_date || new Date(newMedicine.expiry_date) <= new Date(newMedicine.manufacturing_date)) {
        toast.error("Expiry date must be later than manufacturing date.");
        return;
      }

      const response = await axios.post(API_URL, newMedicine);
      setMedicineData([...medicineData, response.data]);
      resetForm();
      setShowModal(false);
      toast.success("Medicine or Drug added successfully!");
    } catch (error) {
      console.error("Error adding medicine", error);
      toast.error("Failed to add medicine. Please try again.");
    }
  };

  const handleEditMedicine = (index) => {
    const selectedMedicine = medicineData[index];
    setFormData({ ...selectedMedicine });
    setEditingId(selectedMedicine.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateMedicine = async () => {
    try {
      const updatedMedicine = {
        ...formData,
      };

      // Check if the expiry date is valid
      if (!updatedMedicine.expiry_date || new Date(updatedMedicine.expiry_date) <= new Date(updatedMedicine.manufacturing_date)) {
        toast.error("Expiry date must be later than manufacturing date.");
        return;
      }

      const response = await axios.put(`${API_URL}${editingId}/`, updatedMedicine);
      const updatedData = medicineData.map((med) =>
        med.id === editingId ? response.data : med
      );
      setMedicineData(updatedData);
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      toast.success("Medicine updated successfully!");
    } catch (error) {
      console.error("Error updating medicine", error);
      toast.error("Failed to update medicine. Please try again.");
    }
  };

  const handleDeleteMedicine = async (index) => {
    try {
      const medicineToDelete = medicineData[index];
      await axios.delete(`${API_URL}${medicineToDelete.id}/`);
      setMedicineData(medicineData.filter((_, i) => i !== index));
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine", error);
      toast.error("Failed to delete medicine. Please try again.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMedicine = medicineData.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to reset the form
  const resetForm = () => {
    setFormData({
      type: "",
      name: "",
      count: "",
      manufacturing_date: "",
      expiry_date: "",
      price: "",
    });
    setSelectedType("");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div className="d-flex">
        <div className="col-lg-2 col-md-4 col-sm-12">
          <AdminDashboard />
        </div>
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="medcontainer p-4">
            <h2 className="heading">Add Medicine/Drug</h2>
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="light" id="dropdown-basic" className="dropdown-toggle">
                {selectedType || "Select Type"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleTypeSelect("Drug")}
                  active={selectedType === "Drug"}
                >
                  Drug
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleTypeSelect("Medicine")}
                  active={selectedType === "Medicine"}
                >
                  Medicine
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{isEditing ? `Edit ${formData.type}` : "Add Medicine/Drugs"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Medicine Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Count</Form.Label>
                    <Form.Control
                      type="number"
                      name="count"
                      value={formData.count}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Manufacturing Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="manufacturing_date"
                      value={formData.manufacturing_date}
                      onChange={handleInputChange}
                      disabled={isEditing}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      disabled={isEditing}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Price of Sheet</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={isEditing ? handleUpdateMedicine : handleAddMedicine}
                    style={{ backgroundColor: '#015d67', color: '#fff', border: 'none' }}
                  >
                    {isEditing ? "Update" : "Add"}
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Search Box */}
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search"
              />
            </InputGroup>

            {/* Table with scrollable section */}
            <div className="table-responsive" style={{ overflowX: "auto", overflowY: "scroll", maxHeight: "350px", }}>
              <Table bordered hover responsive>
                <thead className="sticky-top bg-light">
                  <tr>
                    <th>Serial No.</th> {/* New header for Serial Number */}
                    <th>Type</th>
                    <th>Medicine Name</th>
                    <th>Count</th>
                    <th style={{ width: "250px" }}>Manufacturing Date</th>
                    <th style={{ width: "250px" }}>Expiry Date</th>
                    <th>Price</th>
                    <th style={{ width: "250px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicine.map((medicine, index) => (
                    <tr key={medicine.id}>
                      <td>{index + 1}</td> {/* Serial Number - starts from 1 */}
                      <td>{medicine.type}</td>
                      <td>{medicine.name}</td>
                      <td>{medicine.count}</td>
                      <td>{medicine.manufacturing_date}</td>
                      <td>{medicine.expiry_date}</td>
                      <td>{medicine.price}</td>
                      <td>
                        <Button variant="success" onClick={() => handleEditMedicine(index)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteMedicine(index)}>
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
      </div>
    </>
  );
};

export default AddMedAdmin;

