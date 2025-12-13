"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const LOGIN_ENDPOINT = "api/logIn";

  // ✅ Helper function to set cookie
  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}${API_BASE.endsWith("/") ? "" : "/"}${LOGIN_ENDPOINT}`;
      const response = await axios.post(url, { email, password });

      const { status, token, user, message } = response.data;

      if (!status) {
        toast.error(message || "Login failed.");
        return;
      }

      // ✅ Save to both localStorage AND cookies (middleware reads cookies)
      if (typeof window !== "undefined") {
        // LocalStorage (for client-side access)
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("roles", JSON.stringify(user.roles));
        localStorage.setItem("permissions", JSON.stringify(user.permissions || []));

        // ✅ Cookies (for middleware access)
        setCookie("token", token);
        setCookie("roles", JSON.stringify(user.roles));
        setCookie("user_id", user.id);
        setCookie("permissions", JSON.stringify(user.permissions));
      }

      toast.success("Successfully logged in");

      // ✅ Check roles (now it's an array)
      const roles = user.roles || [];
      const hasAdminAccess = roles.some(role =>
        ["super-admin", "admin"].includes(role)
      );

      if (hasAdminAccess) {
        router.push("/dashboard");
      } else {
        toast.error("Access denied. You are not an admin.");
        router.push("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 py-5 d-flex justify-content-center">
      <div className="col-12 col-md-6 col-lg-10">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h1 className="h4 mb-1 text-center position-relative d-inline-block">
                Log In
                <span
                  className="d-block mx-auto mt-2 btn-grad"
                  style={{ width: "80px", height: "5px", borderRadius: "50px" }}
                ></span>
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-transparent border-start-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-grad w-100 py-2 mt-3 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}