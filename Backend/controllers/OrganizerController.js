// import Organizer from "../models/Organizer.js";


// export const subscription = async (req, res) => {
//   try {
//     const { plan, status, amount, eventsAllowed } = req.body;

//     const startDate = new Date();
//     const endDate =
//       plan === "annual"
//         ? new Date(new Date().setFullYear(startDate.getFullYear() + 1))
//         : new Date(new Date().setMonth(startDate.getMonth() + 1));

//     const organiser = await Organizer.findByIdAndUpdate(
//       req.params.id,
//       {
//         subscription: {
//           plan,
//           status,
//           amount,
//           eventsAllowed,
//           eventsUsed: 0,
//           startDate,
//           endDate,
//         },
//         status: "active",
//       },
//       { new: true }
//     );

//     res.json({
//       message: "Subscription updated successfully ✅",
//       organiser,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Subscription update failed ❌" });
//   }
// };



// export const findOrganizer = async (req, res) => {
//   const organisers = await Organizer.find();
//   res.json(organisers);
// };


// // pending organiser
// export const pendingOrganizer = async (req, res) => {
//   const organisers = await Organizer.find({ status: "pending" });
//   res.json(organisers);
// };

// OrganizerController.js
// OrganizerController.js
import Organizer from "../models/Organizer.js";


export const subscription = async (req, res) => {
  try {
    const { plan, status, amount, eventsAllowed } = req.body;

    const startDate = new Date();
    const endDate =
      plan === "annual"
        ? new Date(new Date().setFullYear(startDate.getFullYear() + 1))
        : new Date(new Date().setMonth(startDate.getMonth() + 1));

    const organiser = await Organizer.findByIdAndUpdate(
      req.params.id,
      {
        subscription: {
          plan,
          status,
          amount,
          eventsAllowed,
          eventsUsed: 0,
          startDate,
          endDate,
        },
        status: "active", // auto activate organiser
      },
      { new: true }
    );

    if (!organiser) {
      return res.status(404).json({ message: "Organiser not found" });
    }

    res.json({
      message: "Subscription updated successfully ✅",
      organiser,
    });
  } catch (error) {
    res.status(500).json({ message: "Subscription update failed ❌" });
  }
};

export const findOrganizer = async (req, res) => {
  const organisers = await Organizer.find();
  res.json(organisers);
};

// pending organiser
export const pendingOrganizer = async (req, res) => {
  const organisers = await Organizer.find({ status: "pending" });
  res.json(organisers);
};
