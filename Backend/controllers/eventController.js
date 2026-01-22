import Event from "../models/Event.js";

// CREATE EVENT 
export const createEvent = async (req, res) => {
  try {
    const eventDate = new Date(req.body.date);
const today = new Date();

const eventState =
  eventDate < today ? "expired" : "upcoming";

    const organiser = req.organizer;
    console.log("EVENT PAYLOAD:", req.body); 
    const event = await Event.create({
      title: req.body.title,
      date: new Date(req.body.date), 
      time: req.body.time,
      location: req.body.location,
      city: req.body.city,
      category: req.body.category,
      price: Number(req.body.price || 0),
      totalTickets: Number(req.body.totalTickets || 0), 
      image: req.body.image,
      description: req.body.description,
      organizerId: organiser._id,
      status: "pending",
      eventState,  
    });

    organiser.subscription.eventsUsed += 1;
    await organiser.save();

    return res.status(201).json({
      message: "Event submitted for admin approval ✅",
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return res.status(500).json({ message: "Event creation failed ❌" });
  }
};



// ADMIN: pending events
export const eventToAdmin = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).populate(
      "organizerId",
      "name email phone"
    );
    res.json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch pending events" });
  }
};

// ADMIN: approve
export const eventToApprove = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "published";
    await event.save();

    res.json({ message: "Event approved & published" });
  } catch {
    res.status(500).json({ message: "Event approval failed" });
  }
};

// ADMIN: reject
export const eventToReject = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "rejected";
    await event.save();

    res.json({ message: "Event rejected successfully" });
  } catch {
    res.status(500).json({ message: "Event rejection failed" });
  }
};

// ADMIN: all events
export const getAllAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizerId");
    res.json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// ORGANIZER EVENTS
export const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id });
    res.json(events);
  } catch {
    res.status(500).json({ message: "Error fetching organizer events" });
  }
};

// PUBLIC EVENTS
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
  status: "published",
  eventState: "upcoming",
});

    res.json(events);
  } catch {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// SINGLE EVENT
export const singleEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("organizerId", "name email phone");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    //  expiry check
    if (event.eventState === "expired") {
      return res.status(410).json({
        message: "This event has expired",
      });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Invalid event ID" });
  }
};


// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

// PUBLISH / UNPUBLISH
export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// EDIT EVENT
export const editEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.json(updatedEvent);
  } catch {
    res.status(500).json({ message: "Failed to update event" });
  }
};
