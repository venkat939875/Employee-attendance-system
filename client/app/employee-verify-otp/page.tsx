"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmployeeVerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Invalid request. Email missing.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      setSuccess("Account verified successfully!");

      setTimeout(() => {
        router.push("/employeelogin");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid request. Email missing.
      </p>
    );
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      
      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md rounded-2xl p-10
                   bg-white shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Verify OTP & Create Password
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="w-full rounded-lg px-4 py-3 
                       bg-white text-slate-800 placeholder-slate-400
                       border border-slate-300 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg px-4 py-3 
                       bg-white text-slate-800 placeholder-slate-400
                       border border-slate-300 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mt-4">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg
                     hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>
      </form>
    </main>
  );
}
