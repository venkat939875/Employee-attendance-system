"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/my`, { credentials: "include" });
      if (!res.ok) { router.push("/employeelogin"); return; }
      const data = await res.json();
      setRecords(data);
      const today = new Date();
      const todayData = data.find((r:any)=> new Date(r.date).toDateString()===today.toDateString());
      setTodayRecord(todayData||null);
    } catch { router.push("/employeelogin"); }
  };

  const markLogin = async () => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/login`,{method:"POST",credentials:"include"});
    await fetchAttendance();
    setLoading(false);
  };

  const markLogout = async () => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logout`,{method:"POST",credentials:"include"});
    await fetchAttendance();
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,{method:"POST",credentials:"include"});
    router.push("/");
  };

  const getStatus = (r:any)=>{
    if(!r.loginTime) return "Absent";
    if(r.totalHours>=8) return "Present";
    if(r.logoutTime && r.totalHours<8) return "Incomplete";
    return "Present";
  };

  const badgeColor = (status:string)=>{
    if(status==="Present") return "bg-emerald-100 text-emerald-700";
    if(status==="Incomplete") return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <main className="relative min-h-screen p-6 md:p-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/empdash.jpg')" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
            <p className="text-gray-200 mt-1">Monitor your attendance & work hours</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">Logout</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="text-sm text-slate-500 mb-2">Today Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(getStatus(todayRecord||{}))}`}>
              {todayRecord ? getStatus(todayRecord) : "Absent"}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="text-sm text-slate-500 mb-2">Total Hours</p>
            <h2 className="text-3xl font-bold text-indigo-600">{todayRecord?.totalHours ?? 0} hrs</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p className="text-sm text-slate-500 mb-2">Login Time</p>
            <h2 className="text-lg font-semibold text-slate-800">
              {todayRecord?.loginTime
                ? new Date(todayRecord.loginTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})
                : "Not Marked"}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 mb-10">
          <button onClick={markLogin} disabled={loading || todayRecord?.loginTime} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
            {loading ? "Processing..." : "Mark Attendance"}
          </button>
          <button onClick={markLogout} disabled={loading || !todayRecord?.loginTime || todayRecord?.logoutTime} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {loading ? "Processing..." : "Mark Logout"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Attendance History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Login</th>
                  <th className="p-3 text-left">Logout</th>
                  <th className="p-3 text-left">Hours</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="text-slate-900">
                {records.map((r:any)=> {
                  const status = getStatus(r);
                  return (
                    <tr key={r._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td className="p-3">{r.loginTime ? new Date(r.loginTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : "-"}</td>
                      <td className="p-3">{r.logoutTime ? new Date(r.logoutTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : "-"}</td>
                      <td className="p-3 font-semibold text-indigo-600">{r.totalHours}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(status)}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
