import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

import React from "react";

const PrivateRoutes = () => {
  
    async function getData() {
      try {
        let data = localStorage.getItem("expiresAt");
        let expiry = await JSON.parse(data);
        if (!expiry) {
          throw new Error("Not logged in");
        }
        if (expiry < Date.now()) {
          localStorage.removeItem("user");
          localStorage.removeItem("expiresAt")
          throw new Error("Session expired");
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    getData();
  

  return getData() ? (
    <>
      <NavBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
