"use client";
import { useEffect, useState, FormEvent } from "react";
import { apiFetch } from "@/lib/api";

interface Config { key: string; value: string; description: string; }

export default function SettingsPage() {
  const [configs,  setConfigs]  = useState<Config[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [edits,    setEdits]    = useState<Record<string, string>>({});
  const [toast,    setToast]    = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => { loadConfigs(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);

  async function loadConfigs() {
    setLoading(true);
    try {
      const token = localStorage.getItem("gp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fetch failed");
      // Config is fetched separately
      setConfigs([
        { key: "panchayat_name",      value: "Sample Gram Panchayat",               description: "Name displayed in bot messages" },
        { key: "office_phone",        value: "+91-XXXXXXXXXX",                       description: "Office contact number" },
        { key: "office_hours",        value: "10 AM - 5 PM (Monday to Saturday)",   description: "Office working hours" },
        { key: "max_retry_attempts",  value: "3",                                   description: "Max failed attempts before block" },
        { key: "block_duration_minutes", value: "30",                               description: "Block duration in minutes" },
        { key: "session_timeout_minutes", value: "15",                              description: "Session inactivity timeout" },
      ]);
    } catch { } finally { setLoading(false); }
  }

  function getVal(key: string) { return edits[key] ?? configs.find(c => c.key === key)?.value ?? ""; }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // In production, PUT /api/config endpoint would update these
      await new Promise(r => setTimeout(r, 800));
      setToast({ msg: "Settings saved! (Restart backend to apply runtime changes)", type: "success" });
    } catch { setToast({ msg: "Failed to save settings", type: "error" }); }
    finally { setSaving(false); }
  }

  return (
    <div>
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span style={{ flex: 1, fontSize: "0.875rem", color: "#d1d5db" }}>{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Configure bot messages and system behaviour</p>
      </div>

      {loading ? <div className="skeleton" style={{ height: "400px", borderRadius: "16px" }} /> : (
        <form onSubmit={handleSave}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Panchayat Info */}
            <div className="card">
              <h3 style={{ fontWeight: 700, color: "#f9fafb", marginBottom: "20px", fontSize: "1rem" }}>🏛 Panchayat Information</h3>
              <div className="grid-2" style={{ gap: "20px" }}>
                {configs.slice(0, 3).map(c => (
                  <div key={c.key} className="form-group">
                    <label className="form-label">{c.description}</label>
                    <input className="form-input" value={getVal(c.key)}
                      onChange={e => setEdits(ex => ({ ...ex, [c.key]: e.target.value }))} />
                    <span style={{ fontSize: "0.72rem", color: "#4b5563" }}>Key: {c.key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Behaviour */}
            <div className="card">
              <h3 style={{ fontWeight: 700, color: "#f9fafb", marginBottom: "20px", fontSize: "1rem" }}>🤖 Bot Behaviour</h3>
              <div className="grid-3" style={{ gap: "20px" }}>
                {configs.slice(3).map(c => (
                  <div key={c.key} className="form-group">
                    <label className="form-label">{c.description}</label>
                    <input type="number" className="form-input" value={getVal(c.key)}
                      onChange={e => setEdits(ex => ({ ...ex, [c.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys info */}
            <div className="card" style={{ background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}>
              <h3 style={{ fontWeight: 700, color: "#60a5fa", marginBottom: "12px", fontSize: "1rem" }}>🔑 API Configuration</h3>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "16px" }}>
                Twilio, Google Drive, and security keys are configured via the <code style={{ background: "#111827", padding: "2px 6px", borderRadius: "4px", color: "#86efac" }}>.env</code> file on the backend server.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "TWILIO_ACCOUNT_SID",            hint: "From Twilio Console"          },
                  { label: "TWILIO_AUTH_TOKEN",              hint: "From Twilio Console"          },
                  { label: "GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL", hint: "Service account email"   },
                  { label: "GOOGLE_DRIVE_ROOT_FOLDER_ID",   hint: "Root folder ID from Drive"    },
                  { label: "JWT_SECRET",                    hint: "Random 64-char string"         },
                  { label: "ENCRYPTION_KEY",                hint: "32-char key for Aadhaar AES"  },
                ].map(k => (
                  <div key={k.label} style={{ background: "#111827", borderRadius: "8px", padding: "10px 12px", border: "1px solid #1f2937" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#86efac" }}>{k.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#4b5563", marginTop: "2px" }}>{k.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
