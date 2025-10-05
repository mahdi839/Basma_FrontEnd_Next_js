"use client";

import React from "react";
import Link from "next/link";

// /**
//  * Dashboard Home (Bootstrap-only, no API calls)
//  * - Drop this into: app/dashboard/page.jsx (or any route)
//  * - Assumes Bootstrap CSS is globally included in your app.
//  */
export default function DashboardHome() {
  // --- Demo/static data (replace with real data when you wire APIs) ---
  const kpis = [
    { label: "Total Sales", value: "$124,890", delta: "+8.3% vs last week" },
    { label: "Orders", value: "1,245", delta: "+2.1%" },
    { label: "Revenue", value: "$82,410", delta: "+5.7%" },
    { label: "Customers", value: "6,871", delta: "+1.9%" },
  ];

  const recentSales = [
    { id: "INV-1042", customer: "Nadia Islam", date: "2025-10-02", total: 320.5, status: "Paid" },
    { id: "INV-1041", customer: "Sabbir Ahmed", date: "2025-10-02", total: 189.0, status: "Pending" },
    { id: "INV-1040", customer: "Afsana Jahan", date: "2025-10-01", total: 142.75, status: "Paid" },
    { id: "INV-1039", customer: "Hasan Ali", date: "2025-10-01", total: 560.0, status: "Refunded" },
  ];

  const topProducts = [
    { name: "Dubai Holiday Package", sales: 214, revenue: 42800 },
    { name: "Cox's Bazar Weekend", sales: 178, revenue: 26700 },
    { name: "Bangkok Tour", sales: 165, revenue: 33200 },
    { name: "Domestic Flight (DAC-CGP)", sales: 142, revenue: 15460 },
  ];

  const tasks = [
    { text: "Confirm hotel bookings", done: true },
    { text: "Prepare October promo banner", done: false },
    { text: "Reconcile invoices (Q3)", done: false },
    { text: "Call supplier for group visa slots", done: true },
  ];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 className="mb-0">Dashboard</h3>
          <small className="text-muted">Overview of sales, orders, and activity</small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary">Create Invoice</button>
          <button className="btn btn-outline-secondary">Export</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((k, i) => (
          <div className="col-12 col-sm-6 col-xl-3" key={i}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-uppercase text-muted small fw-semibold">{k.label}</div>
                    <div className="display-6 fw-semibold">{k.value}</div>
                    <div className="text-success small mt-1">{k.delta}</div>
                  </div>
                  <span className="badge bg-light text-dark">↗</span>
                </div>
                {/* Progress hint */}
                <div className="progress mt-3" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar" style={{ width: `${60 + i * 8}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="row g-3">
        {/* Sales Overview (placeholder chart) */}
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Sales Overview</h6>
              <div className="btn-group">
                <button className="btn btn-sm btn-outline-secondary active">7d</button>
                <button className="btn btn-sm btn-outline-secondary">30d</button>
                <button className="btn btn-sm btn-outline-secondary">90d</button>
              </div>
            </div>
            <div className="card-body">
              {/* Simple SVG placeholder (no libs) */}
              <div className="ratio ratio-21x9 border rounded bg-light d-flex align-items-center justify-content-center">
                <svg viewBox="0 0 600 220" width="100%" height="100%" preserveAspectRatio="none">
                  <rect x="0" y="0" width="600" height="220" fill="transparent" />
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,170 50,160 100,150 150,140 200,120 250,140 300,110 350,115 400,90 450,95 500,70 550,85 600,60"
                  />
                  {Array.from({ length: 7 }).map((_, i) => (
                    <circle key={i} cx={50 + i * 80} cy={160 - i * 10} r="3" fill="currentColor" />
                  ))}
                </svg>
              </div>
              <div className="d-flex flex-wrap gap-3 mt-3">
                <span className="badge rounded-pill text-bg-primary">Revenue</span>
                <span className="badge rounded-pill text-bg-secondary">Orders</span>
                <span className="badge rounded-pill text-bg-success">Conversion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="mb-3">Quick Stats</h6>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Today Sales</span>
                <strong>$2,430</strong>
              </div>
              <div className="progress mb-3" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: "68%" }} />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">New Customers</span>
                <strong>38</strong>
              </div>
              <div className="progress mb-3" style={{ height: 6 }}>
                <div className="progress-bar bg-success" style={{ width: "52%" }} />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted">Refunds</span>
                <strong>3</strong>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar bg-danger" style={{ width: "12%" }} />
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="mb-3">Tasks</h6>
              <ul className="list-group list-group-flush">
                {tasks.map((t, idx) => (
                  <li key={idx} className="list-group-item d-flex align-items-center gap-2 px-0">
                    <input className="form-check-input me-2" type="checkbox" checked={t.done} readOnly />
                    <span className={t.done ? "text-decoration-line-through text-muted" : ""}>{t.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="col-12 col-xxl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Recent Sales</h6>
              <Link href="#" className="btn btn-sm btn-outline-primary">View all</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th className="text-end">Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-semibold">{s.id}</td>
                        <td>{s.customer}</td>
                        <td><span className="badge text-bg-light">{s.date}</span></td>
                        <td className="text-end">${s.total.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${
                            s.status === "Paid"
                              ? "text-bg-success"
                              : s.status === "Pending"
                              ? "text-bg-warning"
                              : "text-bg-danger"
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-12 col-xxl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white">
              <h6 className="mb-0">Top Products</h6>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {topProducts.map((p, i) => (
                  <li key={i} className="list-group-item px-0 d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-semibold">{p.name}</div>
                      <small className="text-muted">{p.sales} sales</small>
                    </div>
                    <span className="badge text-bg-primary">${p.revenue.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline / Activity */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Activity</h6>
              <div className="form-text">Last updated just now</div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-12 col-md-6 col-xl-3">
                    <div className="p-3 rounded border d-flex gap-3 align-items-start">
                      <div className="badge text-bg-secondary rounded-pill">{i}</div>
                      <div>
                        <div className="fw-semibold">Milestone #{i}</div>
                        <small className="text-muted">Description for a recent activity or event that happened in the system.</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-muted small mt-4">© {new Date().getFullYear()} Imperial Tours — Dashboard</div>
    </div>
  );
}
