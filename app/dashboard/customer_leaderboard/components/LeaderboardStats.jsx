"use client"
import React, { useEffect, useState } from 'react'
import { 
  FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, 
  FaStar, FaTrophy, FaArrowUp, FaArrowDown 
} from 'react-icons/fa'
import { HiTrendingUp } from 'react-icons/hi'
import axios from 'axios'

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
        process.env.NEXT_PUBLIC_BACKEND_URL + 'api/customers/statistics',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
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
                    <span className="placeholder rounded-circle" style={{ width: '48px', height: '48px' }}></span>
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
      title: 'Total Customers',
      value: stats.total_customers,
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      iconColor: '#667eea',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: FaShoppingCart,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
      iconColor: '#f5576c',
      trend: '+8.3%',
      trendUp: true,
    },
    {
      title: 'Total Revenue',
      value: `৳${(stats.total_revenue / 1000).toFixed(1)}K`,
      fullValue: `৳ ${stats.total_revenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
      iconColor: '#4facfe',
      trend: '+15.7%',
      trendUp: true,
    },
    {
      title: 'Avg Order Value',
      value: `৳${Math.round(stats.average_order_value).toLocaleString()}`,
      icon: FaChartLine,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgColor: 'rgba(250, 112, 154, 0.1)',
      iconColor: '#fa709a',
      trend: '-2.4%',
      trendUp: false,
    },
    {
      title: 'New Customers',
      value: stats.new_customers,
      icon: FaStar,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      bgColor: 'rgba(48, 207, 208, 0.1)',
      iconColor: '#30cfd0',
      trend: '+18.2%',
      trendUp: true,
    },
    {
      title: 'Repeat Customers',
      value: stats.repeat_customers,
      icon: FaTrophy,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgColor: 'rgba(168, 237, 234, 0.1)',
      iconColor: '#ff6b6b',
      percentage: `${((stats.repeat_customers / stats.total_customers) * 100).toFixed(1)}%`,
      trend: '+5.1%',
      trendUp: true,
    },
  ];

  return (
    <>
      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-sm-6">
            <div className="stat-card card border-0 shadow-sm h-100 overflow-hidden position-relative">
              {/* Gradient Background Overlay */}
              <div 
                className="position-absolute w-100 h-100 opacity-10"
                style={{ background: stat.gradient, top: 0, left: 0 }}
              ></div>

              <div className="card-body position-relative">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <p className="text-muted mb-1 small fw-medium text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                      {stat.title}
                    </p>
                    <h3 className="mb-0 fw-bold" style={{ fontSize: '1.75rem' }} title={stat.fullValue}>
                      {stat.value}
                    </h3>
                    {stat.percentage && (
                      <small className="text-muted mt-1 d-block">
                        {stat.percentage} of total
                      </small>
                    )}
                  </div>
                  <div
                    className="icon-wrapper rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ 
                      background: stat.bgColor,
                      width: '48px', 
                      height: '48px',
                      flexShrink: 0
                    }}
                  >
                    <stat.icon style={{ color: stat.iconColor }} size={24} />
                  </div>
                </div>

                {/* Trend Indicator */}
                {stat.trend && (
                  <div className="d-flex align-items-center gap-1">
                    <span 
                      className={`badge d-inline-flex align-items-center gap-1 ${
                        stat.trendUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                      }`}
                      style={{ fontSize: '0.7rem', padding: '4px 8px', fontWeight: '600' }}
                    >
                      {stat.trendUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                      {stat.trend}
                    </span>
                    <small className="text-muted">vs last month</small>
                  </div>
                )}
              </div>

              {/* Animated Border Bottom */}
              <div 
                className="stat-border"
                style={{ 
                  height: '3px', 
                  background: stat.gradient,
                  width: '0%',
                  transition: 'width 1s ease-in-out'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Summary Card */}
      <div className="card border-0 shadow-sm mb-4 overflow-hidden">
        <div className="card-body p-4 position-relative">
          <div 
            className="position-absolute w-100 h-100 opacity-5"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              top: 0,
              left: 0
            }}
          ></div>
          <div className="row align-items-center position-relative">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: '48px',
                    height: '48px'
                  }}
                >
                  <HiTrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Customer Insights</h5>
                  <small className="text-muted">Your business performance overview</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="d-flex flex-column gap-2">
                <div>
                  <small className="text-muted d-block">Repeat Rate</small>
                  <span className="fw-bold text-success" style={{ fontSize: '1.25rem' }}>
                    {((stats.repeat_customers / stats.total_customers) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success"
                    style={{ 
                      width: `${(stats.repeat_customers / stats.total_customers) * 100}%`,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        .stat-card:hover .stat-border {
          width: 100% !important;
        }
        .icon-wrapper {
          transition: all 0.3s ease;
        }
        .stat-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stat-card {
          animation: slideIn 0.5s ease-out;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .stat-card:nth-child(5) { animation-delay: 0.5s; }
        .stat-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
    </>
  );
}