
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "react-bootstrap";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons"; // Importing the truck icon
import { ToastContainer, toast } from 'react-toastify'; // Importing ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const PendingAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState([]); // Array to track loading states of each order

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

  const handleDelivered = (index, id) => {
    const newLoading = [...loading];
    newLoading[index] = true; // Set loading for the specific button to true
    setLoading(newLoading); // Update the loading state

    axios
      .post(`http://127.0.0.1:8000/api/order-details/${id}/`, { delivery_status: 'Delivered' })
      .then((response) => {
        // Use toast instead of alert
        toast.success("Successfully delivered"); // Show success toast notification

        axios
          .get("http://127.0.0.1:8000/api/pending-orders/")
          .then((response) => {
            setOrderData(response.data); // Update the state with the new data
          })
          .catch((error) => {
            console.error("Error fetching updated orders:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating delivery status:", error);
      })
      .finally(() => {
        newLoading[index] = false; // Set loading for the specific button back to false
        setLoading(newLoading); // Update the loading state
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

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/pending-orders/")
      .then((response) => {
        console.log(response.data); // Log to ensure data is fetched correctly
        setOrderData(response.data);
        setLoading(Array(response.data.length).fill(false)); // Initialize loading array based on order count
      })
      .catch((error) => {
        console.error("Error fetching pending orders:", error);
      });
  }, []);

  const filteredOrders = orderData.filter((order) =>
    order?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex">
        <div className="col-lg-2 col-md-4 col-sm-12">
          <AdminDashboard />
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

            <div
              className="table-responsive"
              style={{ maxHeight: "430px", overflowY: "scroll", overflowX: "auto" }}
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
                    <th>Action</th>
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
                          {order.delivery_status === "Pending" ? (
                            <b>
                              <p style={{ color: "#c30010" }}>
                                {order.delivery_status}
                              </p>
                            </b>
                          ) : (
                            <b>
                              <p style={{ color: "#0b6623" }}>
                                {order.delivery_status}
                              </p>
                            </b>
                          )}
                        </td>
                        <td>
                          <Button
                            className={loading[index] ? "loading" : ""}
                            style={{
                              backgroundColor: "#00b4d8",
                              borderColor: "#00b4d8",
                              position: "relative",
                              overflow: "hidden",
                              transition: "transform 1s ease", // Adding transition for smooth movement
                            }}
                            onClick={() => handleDelivered(index, order.id)} // Pass index and id
                            disabled={loading[index]} // Disable button when loading for this specific order
                          >
                            {loading[index] ? (
                              <span className="truck-animation">
                                <FontAwesomeIcon icon={faTruck} className="mr-2 truck" />
                              </span>
                            ) : (
                              <FontAwesomeIcon icon={faTruck} className="mr-2" />
                            )}
                            {loading[index] ? "Delivering..." : "Deliver"}
                            {loading[index] && (
                              <style jsx>{`
                                .loading {
                                  animation: moveLeft 1s linear infinite; // Animation for moving left
                                }

                                @keyframes moveLeft {
                                  0% { transform: translateX(0); } // Start at original position
                                  100% { transform: translateX(-100%); } // Move left by 100%
                                }
                              `}</style>
                            )}
                          </Button>
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

      {/* ToastContainer component should be rendered to display notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* CSS for truck animation */}
      <style jsx>{`
        .truck-animation {
          animation: truckMove 1s linear infinite;
        }

        @keyframes truckMove {
          0% { transform: translateX(10px); } /* Start from 10px to the right */
          100% { transform: translateX(-10px); } /* Move to 10px to the left */
        }

        .truck {
          transition: transform 0.5s ease;
        }
      `}</style>
    </>
  );
};

export default PendingAdmin;
