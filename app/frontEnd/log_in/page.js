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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}${
        API_BASE.endsWith("/") ? "" : "/"
      }${LOGIN_ENDPOINT}`;
      const response = await axios.post(url, { email, password });
      const { status, token, role, message } = response.data;

      if (!status) {
        toast.error(message || "Login failed.");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        if (role) localStorage.setItem("role", role);
      }

      toast.success("Successfully logged in");

      if (role === "admin" || role === "super_admin") {
        router.push("/dashboard");
      } else {
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
                  className="d-block mx-auto mt-2"
                  style={{
                    width: "80px", // width of curved border
                    height: "5px", // thickness of curve
                    borderRadius: "50px", // creates the curve
                    background:
                      "linear-gradient(90deg, #fd450dff 0%, #f27d10ff 100%)", // color gradient
                    marginTop: "8px",
                  }}
                ></span>
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg"
                    id="password"
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
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
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
