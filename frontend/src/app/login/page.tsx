"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("gp_token", data.token);
      localStorage.setItem("gp_admin", JSON.stringify(data.admin));
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #030712 0%, #052e16 50%, #030712 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative background circles */}
      <div style={{ position:"absolute", top:"-120px", right:"-120px", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.12), transparent)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.08), transparent)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"420px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ fontSize:"3.5rem", marginBottom:"12px" }}>🏛</div>
          <h1 style={{ fontSize:"1.6rem", fontWeight:800, color:"#f9fafb", lineHeight:1.2 }}>
            Gram Panchayat
          </h1>
          <p style={{ color:"#22c55e", fontWeight:600, marginTop:"4px", fontSize:"0.95rem" }}>
            Digital Document Service
          </p>
          <p style={{ color:"#6b7280", fontSize:"0.825rem", marginTop:"8px" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:"rgba(31,41,55,0.8)",
          border:"1px solid rgba(55,65,81,0.8)",
          borderRadius:"20px",
          padding:"32px",
          backdropFilter:"blur(12px)",
        }}>
          <h2 style={{ fontSize:"1.2rem", fontWeight:700, marginBottom:"24px", color:"#f9fafb" }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              background:"rgba(239,68,68,0.12)",
              border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:"10px",
              padding:"12px 14px",
              marginBottom:"20px",
              color:"#f87171",
              fontSize:"0.875rem",
              display:"flex",
              alignItems:"center",
              gap:"8px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@panchayat.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width:"100%", justifyContent:"center", padding:"13px 20px", fontSize:"0.95rem", marginTop:"4px" }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop:"24px", padding:"14px", background:"rgba(34,197,94,0.08)", borderRadius:"10px", border:"1px solid rgba(34,197,94,0.15)" }}>
            <p style={{ fontSize:"0.78rem", color:"#86efac", fontWeight:600, marginBottom:"4px" }}>🛠 First time? Create admin account:</p>
            <code style={{ fontSize:"0.72rem", color:"#6b7280", wordBreak:"break-all" }}>
              POST /api/auth/setup {"{ email, password, fullName }"}
            </code>
          </div>
        </div>

        <p style={{ textAlign:"center", color:"#4b5563", fontSize:"0.78rem", marginTop:"24px" }}>
          Gram Panchayat Digital Document Service v1.0
        </p>
      </div>
    </div>
  );
}
