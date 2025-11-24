import { NavLink, Outlet } from "react-router-dom";


const Dashboard = () => {
  return (
    <div>
        <div className="sidebar">
        <h1>Dashboard</h1>

        <ul>
          <li>
            <NavLink to="/admin/dashboard/users" end>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/dashboard/orders" end>
              Orders
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  )
}

export default Dashboard