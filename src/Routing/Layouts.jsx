import { Outlet, Link } from "react-router-dom";

const Layouts = () => {
  return (
    <>
      {/* Navigation Bar */}
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/AdminUserLogin">Admin User Login</Link>
            </li>
            <li>
              <Link to="/ResetPassword">ResetPassword</Link>
            </li>
            <li>
              <Link to="/OTPUserAdmin">OTPUserAdmin</Link>
            </li>
            <li>
              <Link to="/complated with resposnsive"></Link>
            </li>
            <li>
              <Link to="/AdminProfile">AdminProfile</Link>
            </li>
            <li>
              <Link to="/AdminDashboard">AdminDashboard</Link>
            </li>
            <li>
              <Link to="/AddMedAdmin">Add med admin</Link>
            </li>
            <li>
              <Link to="/AddShopAdmin">add shop</Link>
            </li>
            <li>
              <Link to="/DeliveryOrderAdmin">DeliveryOrderAdmin</Link>
            </li>
            <li>
              <Link to="/PendingAdmin">pendingadmin</Link>
            </li>
            <li>
              <Link to="/complated with resposnsive"></Link>
            </li>
            <li>
              <Link to="/UserProfile">UserProfile</Link>
            </li>
            <li>
              <Link to="/UserDashboard">UserDashboard</Link>
            </li>
            <li>
              <Link to="/AddOrderUser">AddOrderUser</Link>
            </li>
            <li>
              <Link to="/DeliveryOrderUser">DeliveryOrderUser</Link>
            </li>
            <li>
              <Link to="/PendingUser">PendingUser</Link>
            </li>
            <li>
              <Link to="/PaymentUser">PaymentUser</Link>
            </li>
            <li>
              <Link to="/Openpage">Openpage</Link>
            </li>

            
            

          </ul>
        </nav>
      </header>
    </>
  );
};

export default Layouts;
