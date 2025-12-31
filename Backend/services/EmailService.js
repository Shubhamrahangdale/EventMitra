// import nodemailer from "nodemailer";

// /* ✅ CREATE ONE TRANSPORTER */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail App Password
//   },
// });

// // Optional: verify once at startup
// transporter.verify()
//   .then(() => console.log("📧 Email service ready"))
//   .catch(err => console.error("❌ Email service error", err));

// /* 🔐 OTP EMAIL */
// export const sendOtpEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"EventMitra 🔐" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Your EventMitra OTP Code",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Your OTP is:</p>
//       <h1 style="letter-spacing:3px">${otp}</h1>
//       <p>This OTP is valid for 5 minutes.</p>
//       <br/>
//       <p>— Team EventMitra</p>
//     `,
//   });
// };

// /* 🎫 TICKET EMAIL WITH PDF */
// export const sendTicketEmail = async (email, pdfPath, booking) => {
//   await transporter.sendMail({
//     from: `"EventMitra 🎫" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Your Event Ticket - EventMitra",
//     html: `
//       <h2>Booking Confirmed 🎉</h2>
//       <p>Hi <b>${booking.userName}</b>,</p>
//       <p>Your ticket for <b>${booking.eventTitle}</b> is confirmed.</p>
//       <p><b>Date:</b> ${booking.eventDate}</p>
//       <p><b>Location:</b> ${booking.location}</p>
//       <p>Your ticket PDF is attached below.</p>
//       <br/>
//       <p>— Team EventMitra</p>
//     `,
//     attachments: [
//       {
//         filename: "EventTicket.pdf",
//         path: pdfPath,
//       },
//     ],
//   });
// };


import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // APP PASSWORD ONLY
    },
  });

  // Verify connection (important)
  await transporter.verify();

  await transporter.sendMail({
    from: `"EventMitra 🔐" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your EventMitra OTP Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:3px">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <br/>
      <p>— Team EventMitra</p>
    `,
  });
};
