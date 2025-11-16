import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const PendingUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('Access_Token'); // Assuming token is stored in localStorage
        if (!token) {
          alert("Authorization token is missing.");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/api/pending/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelivered = (index) => {
    const updatedOrders = [...orderData];
    updatedOrders[index].delivery_status = "Delivered";
    console.log("Order delivered:", updatedOrders[index]);
  };

  const handlePayment = (index, paymentStatus) => {
    const updatedOrders = [...orderData];
    updatedOrders[index].payment_status = paymentStatus;
    console.log("Payment status updated:", updatedOrders[index]);
  };

  const filteredOrders = orderData.filter((order) =>
    order.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex">
        <div className="col-lg-2 col-md-4 col-sm-12">
          <UserDashboard />
        </div>
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="shop-container">
            <h1 className="heading">Pending Orders</h1>
            <div className="input-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search Orders..."
                onChange={handleSearch}
                style={{
                  borderRadius: "50px",
                  width: "300px",
                  padding: "8px",
                }}
              />
            </div>
            <div className="table-responsive" style={{ overflowX: "auto", width: "100%" }}>
              <table className="table" style={{ minWidth: "1600px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Shop Name</th>
                    <th>Shop Address</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.shop_name}</td>
                        <td>{order.address}</td>
                        <td>{order.drug_name || order.medicine_name}</td>
                        <td>{order.count}</td>
                        <td>
                          {order.delivery_status === "Pending" ? (
                            <p style={{ color: "#c30010" }}
                              
                              onClick={() => handleDelivered(index)}
                            >
                              <b>Pending</b>
                            </p>
                          ) : (
                          <p disabled>
                              <b>Delivered</b>
                            </p>
                          )}
                        </td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>
                          {order.payment_status === "Paid" ? (
                            <Button
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#74c365",
                                color: "#74c365",
                              }}
                              disabled
                            >
                              <FontAwesomeIcon icon={faCheck} className="mr-2" />
                              <b>Paid</b>
                            </Button>
                          ) : (
                            <>
                              <Button
                                style={{
                                  backgroundColor: "#ffffff",
                                  borderColor: "#74c365",
                                  color: "#74c365",
                                }}
                                onClick={() => handlePayment(index, "Paid")}
                              >
                                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                <b>Paid</b>
                              </Button>
                              <Button
                                style={{
                                  backgroundColor: "#ffffff",
                                  borderColor: "#f94449",
                                  color: "#f94449",
                                }}
                                onClick={() => handlePayment(index, "Unpaid")}
                              >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                <b>Unpaid</b>
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingUser;
