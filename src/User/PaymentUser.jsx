import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const PaymentUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  const fetchUnpaidOrders = async () => {
    try {
      const token = localStorage.getItem('Access_Token'); // Assuming you're storing the JWT token
      if (!token) {
        alert("Authorization token is missing.");
        return;
      }
      const response = await fetch("http://127.0.0.1:8000/api/unpaid/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching unpaid orders:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelivered = (index) => {
    const updatedOrders = [...orderData];
    updatedOrders[index].delivery_status = "Delivered";
    setOrderData(updatedOrders);
    console.log("Order delivered:", updatedOrders[index]);
  };

  const handlePayment = (index, paymentStatus) => {
    const updatedOrders = [...orderData];
    updatedOrders[index].paymentStatus = paymentStatus;
    setOrderData(updatedOrders);
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
            <h1 className="heading">Payment Status</h1>

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

            <div className="table-responsive">
              <table className="table w-100" style={{ minWidth: "1600px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Shop Name</th>
                    <th>Shop Address</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Order Date</th>
                    <th>Status</th>
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
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>{order.delivery_status === "Pending" ? (
                            <p style={{ color: "#c30010" }}
                              onClick={() => handleDelivered(index)}
                            >
                              <b>Pending</b>
                            </p>
                          ) : (
                          <p style={{ color: "#0b6623" }}>
                              <b>Delivered</b>
                            </p>
                          )}
                        </td>
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
                      <td colSpan="9" className="text-center">
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

export default PaymentUser;
