import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ================================
   🔐 EMAIL OTP API FUNCTIONS
================================ */

const BASE_URL = "http://localhost:2511/api/auth";

export const sendOtp = async (email) => {
  const response = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return response.json();
};

export const verifyOtp = async (email, otp) => {
  const response = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  return response.json();
};
