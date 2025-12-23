import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required ❌",
            });
        }

        await Contact.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            message: "Message sent successfully 📩",
        });
    } catch (error) {
        console.error("❌ Contact save error:", error);
        res.status(500).json({
            message: "Server error ❌",
        });
    }
};
