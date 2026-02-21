"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);

      // ✅ Redirect to dashboard
      router.push("/employee-dashboard");

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/empbg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-2xl p-10 bg-white shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          Employee Login
        </h1>

        <p className="text-center text-slate-600 mb-8">
          Access your attendance dashboard
        </p>

        <input
          type="email"
          placeholder="Employee Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-3 mb-5 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg px-4 py-3 mb-6 bg-white text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/employeesignup")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </main>
  );
}
