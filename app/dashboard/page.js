"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import useFormatDate from "../hooks/useFormatDate";

const STATUSES = ["pending", "placed", "delivered", "cancel"];

/** Simple canvas bar chart (no libs) */
function HotProductsBarChart({ data = [], hotBy = "qty", height = 260 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const h = height * dpr;

    canvas.width = width;
    canvas.height = h;
    ctx.clearRect(0, 0, width, h);

    const padL = 40 * dpr;
    const padR = 16 * dpr;
    const padT = 16 * dpr;
    const padB = 36 * dpr;

    const innerW = width - padL - padR;
    const innerH = h - padT - padB;

    const values =
      hotBy === "revenue"
        ? data.map((d) => Number(d.revenue))
        : data.map((d) => Number(d.qty_sold));

    // ✅ Changed: Use size_name instead of variant_value
    const labels = data.map(
      (d) => (d.title || `#${d.product_id}`) + (d.size_name ? ` (${d.size_name})` : "")
    );

    const maxVal = Math.max(1, ...values);
    const barGap = 12 * dpr;
    const barW = Math.max(10 * dpr, innerW / values.length - barGap);

    ctx.strokeStyle = "#dee2e6";
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(width - padR, h - padB);
    ctx.stroke();

    ctx.fillStyle = "#0d6efd";
    values.forEach((v, i) => {
      const x = padL + i * (barW + barGap) + barGap / 2;
      const bh = (v / maxVal) * innerH;
      const y = h - padB - bh;
      ctx.fillRect(x, y, barW, bh);

      ctx.fillStyle = "#212529";
      ctx.font = `${12 * dpr}px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      const txt =
        hotBy === "revenue" ? `৳${Number(v).toLocaleString()}` : `${Number(v).toLocaleString()}`;
      ctx.fillText(txt, x + barW / 2, y - 4 * dpr);

      ctx.fillStyle = "#0d6efd";
    });

    ctx.fillStyle = "#6c757d";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `${11 * dpr}px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`;
    labels.forEach((lb, i) => {
      const x = padL + i * (barW + barGap) + barGap / 2 + barW / 2;
      const short = lb.length > 20 ? lb.slice(0, 20) + "…" : lb;
      ctx.fillText(short, x, h - padB + 8 * dpr);
    });
  }, [data, hotBy, height]);

  return (
    <div className="ratio ratio-21x9 border rounded bg-white">
      <canvas ref={canvasRef} style={{ width: "100%", height }} />
    </div>
  );
}

const { formatDate } = useFormatDate();

export default function DashboardHome() {
  const [range, setRange] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [hotBy, setHotBy] = useState("qty");
  const [hotLimit, setHotLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const apiBase = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
  const tokenFromEnv = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("range", range);
    if (range === "custom") {
      if (startDate) params.set("start_date", startDate);
      if (endDate) params.set("end_date", endDate);
    }
    if (selectedStatuses.length) params.set("status", selectedStatuses.join(","));
    if (hotBy) params.set("hot_by", hotBy);
    if (hotLimit) params.set("hot_limit", String(hotLimit));
    return params.toString();
  }, [range, startDate, endDate, selectedStatuses, hotBy, hotLimit]);

  const fetchSummary = async () => {
    setLoading(true);
    setErr("");
    try {
      const token =
        (typeof window !== "undefined" && localStorage.getItem("token")) ||
        tokenFromEnv;

      if (!token) {
        throw new Error(
          "No auth token found. Save it as localStorage('token') after login, or set NEXT_PUBLIC_API_TOKEN for testing."
        );
      }

      const url = `${apiBase}/api/dashboard/summary?${query}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Request failed: ${res.status} ${res.statusText} — ${text || "No response body"}`
        );
      }

      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr(e.message || "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [query]);

  const fmtMoney = (num) => {
    const n = Number(num ?? 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totals = data?.totals || {};
  const hotProducts = data?.hot_products || [];
  const kpis = [
    { label: "Total Sales", key: "sales_amount" },
    { label: "Orders", key: "orders" },
    { label: "Revenue", key: "revenue" },
    { label: "Customers", key: "customers" },
  ];

  const isSelected = (s) => selectedStatuses.includes(s);
  const toggleStatus = (s) =>
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const clearStatuses = () => setSelectedStatuses([]);
 
  

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 className="mb-0">Dashboard</h3>
          <small className="text-muted">Overview of sales, orders, and activity</small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchSummary}>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-6 col-md-2">
              <label className="form-label">Range</label>
              <select className="form-select" value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {range === "custom" && (
              <>
                <div className="col-6 col-md-2">
                  <label className="form-label">Start date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label">End date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="col-12 col-md-3">
              <label className="form-label">Status</label>
              <div className="dropdown w-100">
                <button
                  className="btn btn-outline-secondary w-100 text-start dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  {selectedStatuses.length === 0 ? "All statuses" : `${selectedStatuses.length} selected`}
                </button>
                <ul className="dropdown-menu p-2 w-100" style={{ maxHeight: 260, overflow: "auto" }}>
                  {STATUSES.map((s) => (
                    <li key={s} className="px-2 py-1">
                      <label className="form-check d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isSelected(s)}
                          onChange={() => toggleStatus(s)}
                        />
                        <span className="form-check-label text-capitalize">{s}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedStatuses.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {selectedStatuses.map((s) => (
                    <span key={s} className="badge text-bg-light text-capitalize">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label">Hot products by</label>
              <select className="form-select" value={hotBy} onChange={(e) => setHotBy(e.target.value)}>
                <option value="qty">Quantity</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label">Hot products limit</label>
              <input
                type="number"
                min={1}
                max={50}
                className="form-control"
                value={hotLimit}
                onChange={(e) => setHotLimit(parseInt(e.target.value || "10", 10))}
              />
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading dashboard…</div>}
      {err && !loading && (
        <div className="alert alert-danger">
          <div className="fw-semibold">Error</div>
          <div className="small">{err}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((k, i) => (
          <div className="col-12 col-sm-6 col-xl-3" key={k.key}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="text-uppercase text-muted small fw-semibold">{k.label}</div>
                <div className="display-6 fw-semibold">
                  {["sales_amount", "revenue"].includes(k.key)
                    ? `৳${fmtMoney(totals[k.key])}`
                    : totals[k.key] ?? 0}
                </div>
                {k.key === "revenue" && (
                  <div className="text-muted small mt-1">
                    Profit: <span className="fw-semibold">৳{fmtMoney(totals?.estimated_profit || 0)}</span>
                  </div>
                )}
                <div className="progress mt-3">
                  <div className="progress-bar" style={{ width: `${60 + i * 8}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Sales Overview</h6>
              <div className="small text-muted">
                {formatDate(data?.range?.from)} — {formatDate(data?.range?.to)}
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="p-3 rounded border h-100">
                    <div className="text-muted small">Revenue</div>
                    <div className="h4 mb-0">৳{fmtMoney(totals?.revenue || 0)}</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 rounded border h-100">
                    <div className="text-muted small">Estimated COGS</div>
                    <div className="h4 mb-0">৳{fmtMoney(totals?.estimated_cogs || 0)}</div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="p-3 rounded border h-100">
                    <div className="text-muted small">Estimated Profit</div>
                    <div className="h4 mb-0">৳{fmtMoney(totals?.estimated_profit || 0)}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-3">
                <span className="badge rounded-pill text-bg-primary">Revenue</span>
                <span className="badge rounded-pill text-bg-secondary">Orders</span>
                <span className="badge rounded-pill text-bg-success">Customers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="mb-3">Quick Stats</h6>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Orders</span>
                <strong>{totals?.orders ?? 0}</strong>
              </div>
              <div className="progress mb-3" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: "68%" }} />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Customers</span>
                <strong>{totals?.customers ?? 0}</strong>
              </div>
              <div className="progress mb-3" style={{ height: 6 }}>
                <div className="progress-bar bg-success" style={{ width: "52%" }} />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Profit</span>
                <strong>৳{fmtMoney(totals?.estimated_profit || 0)}</strong>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar bg-info" style={{ width: "40%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <h6 className="mb-0">Top Products</h6>
              <div className="small text-muted">
                Sorted by <code>{hotBy}</code>, top <code>{hotLimit}</code>
              </div>
            </div>
            <div className="card-body">
              {hotProducts.length === 0 ? (
                <div className="text-muted">No products in this range.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th className="text-end">Qty sold</th>
                        <th className="text-end">Revenue</th>
                        <th className="text-end">Est. COGS</th>
                        <th className="text-end">Est. Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotProducts.map((p, i) => (
                        <tr key={`${p.product_id}-${p.size_id}-${i}`}>
                          <td className="fw-semibold">{p.title || p.product_id}</td>
                          <td><span className="badge text-bg-light">{p.size_name ?? "-"}</span></td>
                          <td className="text-end">{Number(p.qty_sold).toLocaleString()}</td>
                          <td className="text-end">৳{fmtMoney(p.revenue)}</td>
                          <td className="text-end">৳{fmtMoney(p.estimated_cogs)}</td>
                          <td className="text-end">৳{fmtMoney(p.estimated_profit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-muted small mt-4">
        © {new Date().getFullYear()} Eyara Fashion — Dashboard
      </div>
    </div>
  );
}