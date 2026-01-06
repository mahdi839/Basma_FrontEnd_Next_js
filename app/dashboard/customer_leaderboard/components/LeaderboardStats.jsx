"use client"
import React, { useEffect, useState } from "react";
import {
  FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine,
  FaStar, FaTrophy, FaArrowUp, FaArrowDown
} from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import axios from "axios";

export default function LeaderboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/customers/statistics",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-lg-2 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="placeholder-glow">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <span className="placeholder col-8 mb-2"></span>
                      <span className="placeholder col-12"></span>
                    </div>
                    <span
                      className="placeholder rounded-circle"
                      style={{ width: "48px", height: "48px" }}
                    ></span>
                  </div>
                  <span className="placeholder col-6"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Customers",
      value: stats.total_customers,
      icon: FaUsers,
      iconColor: "#3B82F6",
      bgColor: "rgba(59,130,246,0.08)",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: FaShoppingCart,
      iconColor: "#6366F1",
      bgColor: "rgba(99,102,241,0.08)",
      trend: "+8.3%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `৳${(stats.total_revenue / 1000).toFixed(1)}K`,
      fullValue: `৳ ${stats.total_revenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      iconColor: "#10B981",
      bgColor: "rgba(16,185,129,0.08)",
      trend: "+15.7%",
      trendUp: true,
    },
    {
      title: "Avg Order Value",
      value: `৳${Math.round(stats.average_order_value).toLocaleString()}`,
      icon: FaChartLine,
      iconColor: "#F59E0B",
      bgColor: "rgba(245,158,11,0.08)",
      trend: "-2.4%",
      trendUp: false,
    },
    {
      title: "New Customers",
      value: stats.new_customers,
      icon: FaStar,
      iconColor: "#F43F5E",
      bgColor: "rgba(244,63,94,0.08)",
      trend: "+18.2%",
      trendUp: true,
    },
    {
      title: "Repeat Customers",
      value: stats.repeat_customers,
      icon: FaTrophy,
      iconColor: "#64748B",
      bgColor: "rgba(100,116,139,0.08)",
      percentage: `${((stats.repeat_customers / stats.total_customers) * 100).toFixed(1)}%`,
      trend: "+5.1%",
      trendUp: true,
    },
  ];

  return (
    <>
      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-sm-6">
            <div
              className="stat-card card border-0 shadow-sm h-100 position-relative"
              style={{
                borderRadius: "12px",
                background: "#fff",
                transition: "0.25s",
                paddingBottom: "4px",
              }}
            >
              <div className="card-body position-relative">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-semibold text-uppercase">
                      {stat.title}
                    </p>
                    <h3 className="fw-bold mb-0" style={{ fontSize: "1.6rem" }}>
                      {stat.value}
                    </h3>

                    {stat.percentage && (
                      <small className="text-muted d-block mt-1">
                        {stat.percentage} of total
                      </small>
                    )}
                  </div>

                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      background: stat.bgColor,
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <stat.icon size={22} style={{ color: stat.iconColor }} />
                  </div>
                </div>

                {stat.trend && (
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <span
                      className={`badge d-flex align-items-center gap-1 ${
                        stat.trendUp
                          ? "bg-success-subtle text-success"
                          : "bg-danger-subtle text-danger"
                      }`}
                      style={{
                        fontSize: "0.7rem",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {stat.trendUp ? (
                        <FaArrowUp size={10} />
                      ) : (
                        <FaArrowDown size={10} />
                      )}
                      {stat.trend}
                    </span>
                    <small className="text-muted">vs last month</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  width: "48px",
                  height: "48px",
                }}
              >
                <HiTrendingUp size={22} color="#3B82F6" />
              </div>

              <div>
                <h5 className="fw-bold mb-0">Customer Insights</h5>
                <small className="text-muted">
                  Your business performance overview
                </small>
              </div>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div>
                <small className="text-muted">Repeat Rate</small>
                <h5 className="fw-bold text-success mt-1">
                  {((stats.repeat_customers / stats.total_customers) * 100).toFixed(1)}%
                </h5>
              </div>

              <div className="progress mt-2" style={{ height: "6px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      (stats.repeat_customers / stats.total_customers) * 100
                    }%`,
                    background: "#3B82F6",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08) !important;
        }
      `}</style>
    </>
  );
}
