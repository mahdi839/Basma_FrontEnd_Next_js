"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

/**
 * RegisterFormBootstrap — Next.js client component (Bootstrap 5)
 *
 * Requirements
 * - Bootstrap CSS loaded globally (e.g., in app/layout.tsx or pages/_app.tsx):
 *   import "bootstrap/dist/css/bootstrap.min.css";
 * - Laravel endpoint: POST /api/sign-up -> AuthController@signUp
 * - Env: NEXT_PUBLIC_BACKEND_URL=https://your-laravel-host
 */

export default function RegisterFormBootstrap({ onSuccessRedirect = "/frontEnd/log_in" }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // server + client errors
  const [touched, setTouched] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const ENDPOINT = "api/signUp";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function clientValidate() {
    const list = [];
    if (!form.name.trim()) list.push("Name is required.");
    if (!form.email.trim()) list.push("Email is required.");
    else if (!emailRegex.test(form.email)) list.push("Email is not valid.");
    if (!form.password) list.push("Password is required.");
    if (form.password && form.password.length < 6) list.push("Password must be at least 6 characters.");
    if (form.confirmPassword !== form.password) list.push("Passwords do not match.");
    setErrors(list);
    return list.length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clientValidate()) return;
    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch(`${API_BASE}${ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.status === false) {
        const msgs = Array.isArray(data?.error) && data.error.length ? data.error : [data?.message || "Registration failed."];
        setErrors(msgs);
        toast.error("Registration failed");
        return;
      }

      toast.success("Account created successfully");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      if (onSuccessRedirect) window.location.assign(onSuccessRedirect);
    } catch (err) {
      console.error(err);
      setErrors(["Network error. Please try again."]); 
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  // per-field validity helpers
  const nameInvalid = touched.name && !form.name.trim();
  const emailInvalid = touched.email && (!form.email.trim() || !emailRegex.test(form.email));
  const pwInvalid = touched.password && (!form.password || form.password.length < 6);
  const cpwInvalid = touched.confirmPassword && form.confirmPassword !== form.password;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 mb-1 text-center">Create your account</h1>
              <p className="text-muted mb-4 text-center">Fill in your details to get started.</p>

              {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  <ul className="mb-0 ps-3">
                    {errors.map((msg, idx) => (
                      <li key={idx}>{String(msg)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form-control ${nameInvalid ? "is-invalid" : touched.name ? "is-valid" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                  />
                  {nameInvalid && <div className="invalid-feedback">Please enter your name.</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${emailInvalid ? "is-invalid" : touched.email ? "is-valid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                  {emailInvalid && <div className="invalid-feedback">Please enter a valid email.</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${pwInvalid ? "is-invalid" : touched.password ? "is-valid" : ""}`}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  {pwInvalid && <div className="invalid-feedback">Password must be at least 6 characters.</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`form-control ${cpwInvalid ? "is-invalid" : touched.confirmPassword ? "is-valid" : ""}`}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  {cpwInvalid && <div className="invalid-feedback">Passwords do not match.</div>}
                </div>

                <button type="submit" className="btn btn-grad w-100" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="mt-3 mb-0 text-center text-muted">
                Already have an account? <a href="/frontEnd/log_in" className="link-dark fw-semibold">Log in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
