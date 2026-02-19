"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const type = params.get("type") || "employee";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Invalid request. Email missing.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Password reset failed");
        return;
      }

      setSuccess("Password reset successful. Redirecting...");

      setTimeout(() => {
        if (type === "admin") {
          router.push("/adminlogin");
        } else {
          router.push("/employeelogin");
        }
      }, 1500);

    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600 font-medium">
          Invalid request. Email missing.
        </p>
      </div>
    );
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fog.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <form
        onSubmit={handleReset}
        className="relative z-10 w-full max-w-md rounded-2xl p-10 bg-white shadow-xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          Reset Password
        </h1>

        <p className="mb-6 text-center text-slate-600">
          Enter OTP and create a new password
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full mb-4 rounded-lg px-4 py-3 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 rounded-lg px-4 py-3 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mb-3">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> Check inbox and spam folder for the OTP and use a strong password.
        </div>
      </form>
    </main>
  );
}
