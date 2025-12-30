import React, { createContext, useContext, useEffect, useState } from "react";

const OrganiserContext = createContext();

export const OrganiserProvider = ({ children }) => {
  const [organisers, setOrganisers] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (adminToken) {
      fetchAllOrganisers();
    }
  }, [adminToken]);

  const fetchAllOrganisers = async () => {
    try {
      const res = await fetch(
        "http://localhost:2511/admin/organisers/all",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await res.json();
      setOrganisers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch organisers");
    }
  };

  return (
    <OrganiserContext.Provider value={{ organisers, setOrganisers, fetchAllOrganisers }}>
      {children}
    </OrganiserContext.Provider>
  );
};

export const useOrganisers = () => useContext(OrganiserContext);
