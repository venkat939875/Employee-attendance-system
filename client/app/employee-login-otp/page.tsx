"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmployeeLoginOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login-otp`,
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
        return;
      }

      router.push("/employee-dashboard");
    } catch (error) {
      console.error(error);
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
      style={{ backgroundImage: "url('/images/verifyotp.jpg')" }}
    >
      
     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>



      
      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md rounded-2xl p-10
                   bg-white shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-4">
          Verify Login OTP
        </h1>

        <p className="text-center text-slate-600 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full rounded-lg px-4 py-3 
                     bg-white text-slate-800 placeholder-slate-400
                     border border-slate-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-600 text-sm text-center mt-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg
                     hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> If OTP has not been received, please check your
          email inbox and also check your spam/junk folder.
        </div>
      </form>
    </main>
  );
}
