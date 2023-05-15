import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4 className="fw-bold">Dashboard</h4>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
            style={{background: "rgb(58,180,174)",
background: "linear-gradient(90deg, rgba(58,180,174,1) 0%, rgba(29,207,253,1) 52%, rgba(69,252,241,1) 100%)",margin:"10px",borderRadius:"20px"}}

          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
            style={{background: "rgb(131,58,180)",
background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(216,29,253,1) 50%, rgba(252,176,69,1) 100%)",margin:"10px",borderRadius:"20px"}}
          >
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
