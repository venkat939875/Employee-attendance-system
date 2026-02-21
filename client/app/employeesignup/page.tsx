"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push("/employeelogin");
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/empsignin.jpg')" }}
    >
      
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md rounded-2xl p-10
                   bg-white shadow-xl"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          Employee Signup
        </h2>

        <p className="text-sm text-slate-600 mb-8 text-center">
          Create your employee account
        </p>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg px-4 py-3 
                       bg-white text-slate-800 placeholder-slate-400
                       border border-slate-300 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

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

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg
                     hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> Use a secure password for your account.
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/employeelogin")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </main>
  );
}
