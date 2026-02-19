"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type") || "employee";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send reset OTP");
        return;
      }

      setSuccess("Reset OTP sent to your email");

      setTimeout(() => {
        router.push(`/reset-password?email=${email}&type=${type}`);
      }, 1500);

    } catch (error) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fog.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSendOtp}
        className="relative z-10 w-full max-w-md rounded-2xl p-10 bg-white shadow-xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          Forgot Password
        </h1>

        <p className="mb-6 text-center text-slate-600">
          Enter your registered email to receive a reset OTP
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-3 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-600 text-sm text-center mt-3">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mt-3">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send Reset OTP"}
        </button>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> Check inbox and spam folder for the reset OTP.
        </div>
      </form>
    </main>
  );
}
