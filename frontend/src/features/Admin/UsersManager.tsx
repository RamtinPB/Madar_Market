"use client";

import { useEffect, useState } from "react";

type User = { id: number; phoneNumber: string; role?: string };

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  async function changeRole(u: User, role: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/users/${u.id}/role`, { method: "PUT", body: JSON.stringify({ role }), headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    setUsers((s) => s.map((x) => (x.id === u.id ? { ...x, role } : x)));
  }

  async function remove(u: User) {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/users/${u.id}`, { method: "DELETE", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    setUsers((s) => s.filter((x) => x.id !== u.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-right font-semibold">کاربران</h2>
      <div className="grid grid-cols-2 gap-3">
        {users.map((u) => (
          <div key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div className="text-right">
              <div className="font-bold">{u.phoneNumber}</div>
              <div className="text-xs text-gray-500">{u.role ?? "USER"}</div>
            </div>

            <div className="flex items-center gap-2">
              <select value={u.role ?? "USER"} onChange={(e) => changeRole(u, e.target.value)} className="border rounded p-1">
                <option value="USER">USER</option>
                <option value="SUB_ADMIN">SUB_ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <button onClick={() => remove(u)} className="text-sm text-red-600">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
