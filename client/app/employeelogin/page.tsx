"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      router.push(`/employee-login-otp?email=${email}&type=employee`);
    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };
return (
  <main
    className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
  >
    
    <div className="absolute inset-0 bg-black/70 z-0"></div>

    
    <form
      onSubmit={handleLogin}
      className={`relative z-10 w-full max-w-md rounded-2xl p-10
      bg-white shadow-xl
      transition-all duration-500
      ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
        Employee Login
      </h1>

      <p className="text-center text-slate-600 mb-8">
        Enter credentials to receive OTP
      </p>

      
      <div className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Employee Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-3 
                     bg-white text-slate-800 placeholder-slate-400
                     border border-slate-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-3 
                     bg-white text-slate-800 placeholder-slate-400
                     border border-slate-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div className="text-right mt-3">
        <button
          type="button"
          onClick={() => router.push("/forgot-password?type=employee")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-3 rounded-lg text-white font-semibold
                   bg-indigo-600 hover:bg-indigo-700
                   transition duration-300 disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-600">
        New employee?{" "}
        <button
          type="button"
          onClick={() => router.push("/employeesignup")}
          className="text-indigo-600 font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  </main>
);
}
