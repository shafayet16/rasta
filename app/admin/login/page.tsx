"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-white/20 p-8">
        <h1 className="text-[12px] font-bold tracking-[0.3em] uppercase border-b border-white/10 pb-4">
          RASTA // ADMIN ACCESS
        </h1>

        {error && (
          <p className="mt-4 text-[10px] tracking-wider uppercase text-red-500">{error}</p>
        )}

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-6 text-[11px] tracking-wider uppercase">
          <div>
            <label className="block text-white/60 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white text-black p-3 font-medium tracking-[0.2em] uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "ENTER DASHBOARD"}
          </button>
        </form>
      </div>
    </main>
  );
}