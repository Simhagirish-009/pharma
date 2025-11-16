

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Spinner } from "react-bootstrap";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryOrderAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/user-order-details/")
      .then((response) => {
        console.log("Order Data:", response.data);
        setOrderData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    axios
      .get(`http://127.0.0.1:8000/api/user-order-details/?search=${term}`)
      .then((response) => {
        console.log("Filtered Orders:", response.data);
        setOrderData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filtered orders:", error);
      });
  };

  const handlePayment = (id, index, paymentStatus) => {
    // Set the loading state for the specific button
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [index]: true, // Only this button is set to loading
    }));

    const updatedOrder = { ...orderData[index], payment_status: paymentStatus };

    axios
      .patch(`http://127.0.0.1:8000/api/order-paid/${id}/`, {
        payment_status: paymentStatus,
      })
      .then((response) => {
        console.log("Payment status updated:", response.data);

        // Update the specific order's payment status in the state
        const updatedOrders = [...orderData];
        updatedOrders[index] = response.data;
        setOrderData(updatedOrders);

        // Display a success toast message
        toast.success(`Payment status updated to ${paymentStatus}`);
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);

        // Display an error toast message
        toast.error("Error updating payment status");
      })
      .finally(() => {
        // Reset the loading state for the specific button
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [index]: false, // Only this button stops loading
        }));
      });
  };

  const formatDateTimeIST = (dateString) => {
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    return formatter.format(new Date(dateString));
  };

  const filteredOrders = orderData.filter(
    (order) =>
      order.delivery_status === "Delivered" &&
      order?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      <ToastContainer />
      <div className="col-lg-2 col-md-4 col-sm-12">
        <AdminDashboard />
      </div>
      <div className="col-lg-9 col-md-8 col-sm-12">
        <div className="shop-container">
          <h1 className="heading">Delivered Orders</h1>
          <div className="input-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search Orders..."
              onChange={handleSearch}
              style={{ borderRadius: "50px", width: "300px", padding: "8px" }}
            />
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "auto" }}
          >
            <table className="table" style={{ width: "200%", fontSize: "16px" }}>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Shop Name</th>
                  <th>Shop Address</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Date Delivered</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={index} style={{ height: "70px" }}>
                      <td>{index + 1}</td>
                      <td>{order.shop_name}</td>
                      <td>{order.address}</td>
                      <td>{order.drug_name || order.medicine_name}</td>
                      <td>{order.count}</td>
                      <td>{formatDateTimeIST(order.order_date)}</td>
                      <td>
                        <b>
                          <p style={{ color: "#0b6623" }}>
                            {order.delivery_status}
                          </p>
                        </b>
                      </td>
                      <td>
                        {order.delivery_status === "Delivered"
                          ? formatDateTimeIST(order.delivery_date)
                          : "-"}
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
                              onClick={() => handlePayment(order.id, index, "Paid")}
                              disabled={loadingStates[index]} // Disable only this button when loading
                            >
                              {loadingStates[index] ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              ) : (
                                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                              )}
                              <b>{loadingStates[index] ? "Processing" : "Paid"}</b>
                            </Button>
                            <Button
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#f94449",
                                color: "#f94449",
                              }}
                              onClick={() => handlePayment(order.id, index, "Unpaid")}
                              disabled={loadingStates[index]} // Disable only this button when loading
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
                    <td colSpan="10" className="text-center">
                      No delivered orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderAdmin;
