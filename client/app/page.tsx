"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/main-bg.jpg')" }}
    >
      
      <div className="absolute inset-0 bg-black/70"></div>

      <div
        className={`relative z-10 w-full max-w-xl text-center text-white
        transition-all duration-500
        ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Employee Attendance
          <br /> Automation System
        </h1>

        <p className="mb-10 text-gray-300">
          Smart attendance tracking with automated login,
          logout monitoring and real-time work hour analytics.
        </p>

       
        <div className="bg-white rounded-2xl p-10 shadow-xl text-slate-800">
          <h2 className="text-2xl font-semibold mb-6">
            Choose Login Type
          </h2>

          <div className="flex flex-col gap-5">

            <button
              onClick={() => router.push("/employeelogin")}
              className="rounded-lg bg-indigo-600 py-3 text-white font-semibold
                         hover:bg-indigo-700 transition duration-300"
            >
             Employee Login
            </button>

            <button
              onClick={() => router.push("/adminlogin")}
              className="rounded-lg bg-slate-800 py-3 text-white font-semibold
                         hover:bg-slate-900 transition duration-300"
            >
              Admin Login
            </button>

          </div>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          © 2026 Employee Attendance System
        </p>
      </div>
    </main>
  );
}
