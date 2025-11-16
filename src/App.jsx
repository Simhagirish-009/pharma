import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layouts from "./Routing/Layouts";
import "./App.css";
import AdminUserLogin from "./Common/AdminUserLogin";
import ResetPassword from "./Common/ResetPassword";
import OTPUserAdmin from "./Common/OTPUserAdmin";
import Openpage from "./Common/Openpage";

import AdminDashboard from "./Admin/AdminDashboard";
import AddMedAdmin from "./Admin/AddMedAdmin";
import AddShopAdmin from "./Admin/AddShopAdmin";
import DeliveryOrderAdmin from "./Admin/DeliveryOrderAdmin";
import AdminProfile from "./Admin/AdminProfile";
import PendingAdmin from "./Admin/PendingAdmin";
import Adminprivaterouting from "./Admin/Adminprivaterouting";

import UserDashboard from "./User/UserDashboard";
import AddOrderUser from "./User/AddOrderUser";
import UserProfile from "./User/UserProfile";
import DeliveryOrderUser from "./User/DeliveryOrderUser";
import PendingUser from "./User/PendingUser";
import PaymentUser from "./User/PaymentUser";
import Userprivaterouting from "./User/Userprivaterouting";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* <Route path='/' element={<Layouts />} /> */}
      <Route path="/AdminUserLogin" element={<AdminUserLogin />} />

      <Route path="/OTPUserAdmin" element={<OTPUserAdmin />} />

      <Route path="/ResetPassword" element={<ResetPassword />} />

      <Route path="/UserProfile" element={<UserProfile />} />

      <Route path="/AdminProfile" element={<AdminProfile />} />

      <Route path="/" element={<Openpage />} />

      <Route
        path="/AdminDashboard"
        element={
          <Adminprivaterouting>
            <AdminDashboard />
          </Adminprivaterouting>
        }
      />

      <Route
        path="/AddMedAdmin"
        element={
          <Adminprivaterouting>
            <AddMedAdmin />
          </Adminprivaterouting>
        }
      />

      <Route
        path="/PendingAdmin"
        element={
          <Adminprivaterouting>
            <PendingAdmin />
          </Adminprivaterouting>
        }
      />

      <Route
        path="/AddShopAdmin"
        element={
          <Adminprivaterouting>
            <AddShopAdmin />
          </Adminprivaterouting>
        }
      />

      <Route
        path="/DeliveryOrderAdmin"
        element={
          <Adminprivaterouting>
            <DeliveryOrderAdmin />
          </Adminprivaterouting>
        }
      />

      <Route
        path="/UserDashboard"
        element={
          <Userprivaterouting>
            <UserDashboard />
          </Userprivaterouting>
        }
      />

      <Route
        path="/AddOrderUser"
        element={
          <Userprivaterouting>
            <AddOrderUser />
          </Userprivaterouting>
        }
      />

      <Route
        path="/DeliveryOrderUser"
        element={
          <Userprivaterouting>
            <DeliveryOrderUser />
          </Userprivaterouting>
        }
      />

      <Route
        path="/PendingUser"
        element={
          <Userprivaterouting>
            <PendingUser />
          </Userprivaterouting>
        }
      />

      <Route
        path="/PaymentUser"
        element={
          <Userprivaterouting>
            <PaymentUser />
          </Userprivaterouting>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
