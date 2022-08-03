import React from "react";
import { Navigate } from "react-router-dom";

function Logout() {
  async function getData() {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  getData();

  return getData() ? (
    <>
      <Navigate to="/login" />
    </>
  ) : (
    <Navigate to="/error" />
  );
}

export default Logout;
