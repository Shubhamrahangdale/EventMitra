import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });


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
