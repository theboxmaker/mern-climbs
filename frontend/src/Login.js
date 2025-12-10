import { useState } from "react";
import { api } from "./api";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch {
      alert("Invalid login");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="input input-bordered w-full"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
