import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group m-2">
          <h4 className="fw-bold">Admin Panel</h4>
          <NavLink
            style={{background:"lavender",margin:"10px",borderRadius:"20px"}}
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </NavLink>
          <NavLink
            style={{background:"lavender",margin:"10px",borderRadius:"20px"}}
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Products
          </NavLink>
          <NavLink
            style={{background:"lavender",margin:"10px",borderRadius:"20px"}}
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            All Products
          </NavLink>
          <NavLink
          style={{background:"lavender",margin:"10px",borderRadius:"20px"}}
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
