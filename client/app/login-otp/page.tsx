"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Invalid request. Email missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/auth/verify-login-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      if (data.role === "admin") {
        router.push("/admindashboard");
      } else {
        router.push("/employee-dashboard");
      }

    } catch {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  if (!email) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid request. Email missing.
      </p>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/adminbg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-10 shadow-xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          Enter OTP
        </h1>

        <p className="mb-6 text-center text-sm text-slate-600">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full rounded-lg px-4 py-3 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> If OTP has not been received, check your inbox and spam/junk folder.
        </div>
      </form>
    </main>
  );
}
