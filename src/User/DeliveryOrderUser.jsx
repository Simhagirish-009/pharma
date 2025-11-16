// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Table, Button } from "react-bootstrap";
// import UserDashboard from "./UserDashboard";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faTimes, faTruck } from '@fortawesome/free-solid-svg-icons';

// const DeliveryOrderUser = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [orderData, setOrderData] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("Access_Token");
//         if (!token) {
//           alert("Authorization token is missing.");
//           return;
//         }
  
//         const response = await axios.get("http://127.0.0.1:8000/api/delivered-orders/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrderData(response.data.orders);  // Adjusted to match the response format
//       } catch (error) {
//         console.error("Error fetching orders: ", error.response?.data || error);
//       }
//     };
  
//     fetchOrders();
//   }, []);
  

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handlePayment = (index, paymentStatus) => {
//     const updatedOrders = [...orderData];
//     updatedOrders[index].paymentStatus = paymentStatus;
//     setOrderData(updatedOrders);
//   };

//   const filteredOrders = orderData.filter((order) =>
//     order.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="d-flex">
//       <div className="col-lg-2 col-md-4 col-sm-12">
//         <UserDashboard />
//       </div>
//       <div className="col-lg-10 col-md-8 col-sm-12">
//         <div className="shop-container">
//           <h1 className="heading">User Delivery Orders</h1>

//           <div className="input-search">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search Orders..."
//               onChange={handleSearch}
//               style={{ borderRadius: "50px", width: "300px", padding: "8px" }}
//             />
//           </div>

//           <div
//             className="table-responsive"
//             style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "auto" }}
//           >
//             <Table className="table" style={{ width: "180%", fontSize: "16px" }}>
//               <thead>
//                 <tr>
//                   <th>Serial No</th>
//                   <th>Shop Name</th>
//                   <th>Shop Address</th>
//                   <th>Product Name</th>
//                   <th>Quantity</th>
//                   <th>Order Date</th>
//                   <th>Date Delivered</th>
//                   <th>Payment Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.length > 0 ? (
//                   filteredOrders.map((order, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{order.shop_name}</td>
//                       <td>{order.address}</td>
//                       <td>{order.drug_name || order.medicine_name}</td>
//                       <td>{order.count}</td>
//                       <td>{new Date(order.order_date).toLocaleString()}</td>
//                       <td>{order.delivery_date ? new Date(order.delivery_date).toLocaleString() : "Pending"}</td>
//                       <td>
//                         {order.payment_status === "Paid" ? (
//                           <Button
//                             style={{
//                               backgroundColor: "#ffffff",
//                               borderColor: "#74c365",
//                               color: "#74c365",
//                             }}
//                             disabled // Disable when already Paid
//                           >
//                             <FontAwesomeIcon icon={faCheck} className="mr-2" />
//                             <b>Paid</b>
//                           </Button>
//                         ) : (
//                           <>
//                             {/* Paid Button */}
//                             <Button
//                               style={{
//                                 backgroundColor: "#ffffff",
//                                 borderColor: "#74c365",
//                                 color: "#74c365",
//                               }}
//                               onClick={() => handlePayment(index, "Paid")}
//                             >
//                               <FontAwesomeIcon icon={faCheck} className="mr-2" />
//                               <b>Paid</b>
//                             </Button>
//                             {/* Unpaid Button */}
//                             <Button
//                               style={{
//                                 backgroundColor: "#ffffff",
//                                 borderColor: "#f94449",
//                                 color: "#f94449",
//                               }}
//                               disabled={order.payment_status === "Paid"} // Disable when Paid
//                               onClick={() => handlePayment(index, "Unpaid")}
//                             >
//                               <FontAwesomeIcon icon={faTimes} className="mr-2" />
//                               <b>Unpaid</b>
//                             </Button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center">
//                       No delivered orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryOrderUser;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Table, Button, Spinner } from "react-bootstrap";
// import UserDashboard from "./UserDashboard";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
// import 'react-toastify/dist/ReactToastify.css';  // Import react-toastify CSS

// const DeliveryOrderUser = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [orderData, setOrderData] = useState([]);
//   const [loadingIndex, setLoadingIndex] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("Access_Token");
//         if (!token) {
//           toast.error("Authorization token is missing."); // Show error toast
//           return;
//         }

//         const response = await axios.get("http://127.0.0.1:8000/api/delivered-orders/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrderData(response.data.orders);
//       } catch (error) {
//         console.error("Error fetching orders: ", error.response?.data || error);
//         toast.error("Error fetching orders!"); // Show error toast
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handlePayment = async (index, paymentStatus) => {
//     setLoadingIndex(index);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       const updatedOrders = [...orderData];
//       updatedOrders[index].payment_status = paymentStatus;
//       setOrderData(updatedOrders);
//       toast.success(`Payment marked as ${paymentStatus} for order ${index + 1}`);  // Show success toast
//     } catch (error) {
//       console.error("Payment update error: ", error);
//       toast.error("Payment update failed!");  // Show error toast
//     } finally {
//       setLoadingIndex(null);
//     }
//   };

//   const filteredOrders = orderData.filter((order) =>
//     order.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="d-flex">
//       <div className="col-lg-2 col-md-4 col-sm-12">
//         <UserDashboard />
//       </div>
//       <div className="col-lg-10 col-md-8 col-sm-12">
//         <div className="shop-container">
//           <h1 className="heading">User Delivery Orders</h1>

//           <div className="input-search">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search Orders..."
//               onChange={handleSearch}
//               style={{ borderRadius: "50px", width: "300px", padding: "8px" }}
//             />
//           </div>

//           <div
//             className="table-responsive"
//             style={{ maxHeight: "400px", overflowY: "scroll", overflowX: "auto" }}
//           >
//             <Table className="table" style={{ width: "180%", fontSize: "16px" }}>
//               <thead>
//                 <tr>
//                   <th>Serial No</th>
//                   <th>Shop Name</th>
//                   <th>Shop Address</th>
//                   <th>Product Name</th>
//                   <th>Quantity</th>
//                   <th>Order Date</th>
//                   <th>Date Delivered</th>
//                   <th>Payment Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.length > 0 ? (
//                   filteredOrders.map((order, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{order.shop_name}</td>
//                       <td>{order.address}</td>
//                       <td>{order.drug_name || order.medicine_name}</td>
//                       <td>{order.count}</td>
//                       <td>{new Date(order.order_date).toLocaleString()}</td>
//                       <td>{order.delivery_date ? new Date(order.delivery_date).toLocaleString() : "Pending"}</td>
//                       <td>
//                         {order.payment_status === "Paid" ? (
//                           <Button
//                             style={{
//                               backgroundColor: "#ffffff",
//                               borderColor: "#74c365",
//                               color: "#74c365",
//                             }}
//                             disabled
//                           >
//                             <FontAwesomeIcon icon={faCheck} className="me-2" />
//                             <b>Paid</b>
//                           </Button>
//                         ) : (
//                           <Button
//                             style={{
//                               backgroundColor: "#ffffff",
//                               borderColor: "#74c365",
//                               color: "#74c365",
//                             }}
//                             onClick={() => handlePayment(index, "Paid")}
//                             disabled={loadingIndex === index}
//                           >
//                             {loadingIndex === index ? (
//                               <Spinner
//                                 as="span"
//                                 animation="border"
//                                 size="sm"
//                                 role="status"
//                                 aria-hidden="true"
//                                 className="me-2"
//                               />
//                             ) : (
//                               <FontAwesomeIcon icon={faCheck} className="me-2" />
//                             )}
//                             <b>{loadingIndex === index ? "Processing..." : "Paid"}</b>
//                           </Button>
                          
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center">
//                       No delivered orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover /> 
//     </div>
//   );
// };

// export default DeliveryOrderUser;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Spinner } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeliveryOrderUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("Access_Token");
        if (!token) {
          toast.error("Authorization token is missing.");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/delivered-orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderData(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders: ", error.response?.data || error);
        toast.error("Error fetching orders!");
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePayment = async (index, paymentStatus) => {
    setLoadingIndex(index);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedOrders = [...orderData];
      updatedOrders[index].payment_status = paymentStatus;
      setOrderData(updatedOrders);
      toast.success(`Payment marked as ${paymentStatus} for order ${index + 1}`);
    } catch (error) {
      console.error("Payment update error: ", error);
      toast.error("Payment update failed!");
    } finally {
      setLoadingIndex(null);
    }
  };

  const filteredOrders = orderData.filter((order) =>
    order.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      <div className="col-lg-2 col-md-4 col-sm-12">
        <UserDashboard />
      </div>
      <div className="col-lg-10 col-md-8 col-sm-12">
        <div className="shop-container">
          <h1 className="heading">User Delivery Orders</h1>

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
            <Table className="table" style={{ width: "180%", fontSize: "16px" }}>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Shop Name</th>
                  <th>Shop Address</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                  <th>Date Delivered</th>
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
                      <td>{new Date(order.order_date).toLocaleString()}</td>
                      <td>{order.delivery_date ? new Date(order.delivery_date).toLocaleString() : "Pending"}</td>
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
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            <b>Paid</b>
                          </Button>
                        ) : (
                          <>
                            <Button
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#74c365",
                                color: "#74c365",
                                marginRight: "5px",
                              }}
                              onClick={() => handlePayment(index, "Paid")}
                              disabled={loadingIndex === index}
                            >
                              {loadingIndex === index ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                              ) : (
                                <FontAwesomeIcon icon={faCheck} className="me-2" />
                              )}
                              <b>{loadingIndex === index ? "Processing..." : "Paid"}</b>
                            </Button>

                            <Button
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#d9534f",
                                color: "#d9534f",
                              }}
                              onClick={() => handlePayment(index, "Unpaid")}
                              disabled={loadingIndex === index}
                            >
                              {loadingIndex === index ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                              ) : (
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                              )}
                              <b>{loadingIndex === index ? "Processing..." : "Unpaid"}</b>
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No delivered orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover /> 
    </div>
  );
};

export default DeliveryOrderUser;
