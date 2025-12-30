// // import React, { createContext, useContext, useEffect, useState } from "react";

// // const EventContext = createContext(undefined);

// // export const EventProvider = ({ children }) => {
// //   const [events, setEvents] = useState([]);
// //   const adminToken = localStorage.getItem("adminToken");

// //   // FETCH PENDING EVENTS FOR ADMIN
// //   const fetchPendingEvents = async () => {
// //     try {
// //       const res = await fetch("http://localhost:2511/api/events/admin/events/pending", {
// //   headers: {
// //     Authorization: `Bearer ${adminToken}`,
// //   },
// // });


// //       const data = await res.json();

// //       // Convert backend data → UI expected format
// //       const formatted = data.map((e) => ({
// //         id: e._id,
// //         title: e.title,
// //         description: e.description,
// //         date: e.date,
// //         time: e.time,
// //         venue: e.location,
// //         category: e.category,
// //         organiserId: e.organizerId?._id,
// //         organiserName: e.organizerId?.name || "Unknown",
// //         status: e.status, // pending | published
// //         createdAt: e.createdAt,
// //       }));

// //       setEvents(formatted);
// //     } catch (err) {
// //       console.error("Failed to fetch admin events", err);
// //     }
// //   };

// //   // APPROVE EVENT
// //   const approveEvent = async (id) => {
// //     await fetch(
// //   `http://localhost:2511/api/events/admin/events/${id}/approve`,
// //   {
// //     method: "PUT",
// //     headers: {
// //       Authorization: `Bearer ${adminToken}`,
// //     },
// //   }
// // );


// //     fetchPendingEvents();
// //   };

// //   // REJECT EVENT

// //   const rejectEvent = async (id) => {
// //   await fetch(
// //   `http://localhost:2511/api/events/admin/events/${id}/reject`,
// //   {
// //     method: "PUT",
// //     headers: {
// //       Authorization: `Bearer ${adminToken}`,
// //     },
// //   }
// // );


// //   fetchPendingEvents();
// // };

  
  
// //   useEffect(() => {
// //     if (adminToken) {
// //       fetchPendingEvents();
// //     }
// //   }, [adminToken]);

// //   return (
// //     <EventContext.Provider
// //       value={{
// //         events,
// //         approveEvent,
// //         rejectEvent,
// //       }}
// //     >
// //       {children}
// //     </EventContext.Provider>
// //   );
// // };

// // export const useEvents = () => {
// //   const context = useContext(EventContext);
// //   if (!context) {
// //     throw new Error("useEvents must be used within EventProvider");
// //   }
// //   return context;
// // };

// import React, { createContext, useContext, useEffect, useState } from "react";

// const EventContext = createContext();

// export const EventProvider = ({ children }) => {
//   const [events, setEvents] = useState([]);
//   const adminToken = localStorage.getItem("adminToken");

//   const fetchPendingEvents = async () => {
//     if (!adminToken) return;

//     try {
//       const res = await fetch(
//         "http://localhost:2511/api/events/admin/events/pending",
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Unauthorized");

//       const data = await res.json();
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to fetch events", err);
//       setEvents([]);
//     }
//   };

//   useEffect(() => {
//     fetchPendingEvents();
//   }, [adminToken]);

//   return (
//     <EventContext.Provider
//       value={{ events, fetchPendingEvents }}
//     >
//       {children}
//     </EventContext.Provider>
//   );
// };

// export const useEvents = () => useContext(EventContext);

// import React, { createContext, useContext, useEffect, useState } from "react";

// const EventContext = createContext();

// export const EventProvider = ({ children }) => {
//   const [events, setEvents] = useState([]);
//   const adminToken = localStorage.getItem("adminToken");

//   // FETCH PENDING EVENTS FOR ADMIN
//   const fetchPendingEvents = async () => {
//     if (!adminToken) return;
//     try {
//       const res = await fetch(
//         "http://localhost:2511/api/events/admin/events/pending",
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Unauthorized");

//       const data = await res.json();
//       // if you need mapping, do it here; for now keep as is
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to fetch events", err);
//       setEvents([]);
//     }
//   };

//   // APPROVE EVENT
//   const approveEvent = async (id) => {
//     if (!adminToken) return;
//     await fetch(
//       `http://localhost:2511/api/events/admin/events/${id}/approve`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     await fetchPendingEvents();
//   };

//   // REJECT EVENT
//   const rejectEvent = async (id) => {
//     if (!adminToken) return;
//     await fetch(
//       `http://localhost:2511/api/events/admin/events/${id}/reject`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       }
//     );
//     await fetchPendingEvents();
//   };

//   useEffect(() => {
//     fetchPendingEvents();
//   }, [adminToken]);

//   return (
//     <EventContext.Provider
//       value={{ events, fetchPendingEvents, approveEvent, rejectEvent }}
//     >
//       {children}
//     </EventContext.Provider>
//   );
// };

// export const useEvents = () => useContext(EventContext);


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const adminToken = localStorage.getItem("adminToken");

  // Get all events for admin (pending + approved + rejected)
  const fetchAdminEvents = async () => {
  if (!adminToken) return;
  const res = await fetch(
    "http://localhost:2511/api/events/admin/events/all",
    {
      headers: { Authorization: `Bearer ${adminToken}` },
    }
  );
  if (!res.ok) throw new Error("Unauthorized");
  const data = await res.json();
  // setEvents(Array.isArray(data) ? data : []);
  const formatted = (Array.isArray(data) ? data : []).map((e) => ({
  ...e,
  organiserName: e.organizerId?.name || e.organiserName || "Unknown",
}));

setEvents(formatted);
};


  const approveEvent = async (id) => {
    if (!adminToken) return;
    await fetch(
      `http://localhost:2511/api/events/admin/events/${id}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    await fetchAdminEvents();
  };

  const rejectEvent = async (id) => {
    if (!adminToken) return;
    await fetch(
      `http://localhost:2511/api/events/admin/events/${id}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    await fetchAdminEvents();
  };

  useEffect(() => {
    fetchAdminEvents();
  }, [adminToken]);

  return (
    <EventContext.Provider
      value={{ events, fetchAdminEvents, approveEvent, rejectEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
