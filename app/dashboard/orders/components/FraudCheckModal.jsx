"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./fraudCheckModal.css";

const EMPTY_RESULT = {
  summary: {
    total_parcel: 0,
    success_parcel: 0,
    cancelled_parcel: 0,
    success_ratio: 0,
  },
  couriers: [],
  reports: [],
  meta: {},
};

function ratioStyle(ratio, total) {
  if (!total) return { className: "fraud-ratio-neutral", label: "No parcel history" };
  if (ratio >= 80) return { className: "fraud-ratio-good", label: "Strong delivery history" };
  if (ratio >= 60) return { className: "fraud-ratio-warning", label: "Mixed delivery history" };
  return { className: "fraud-ratio-danger", label: "High cancellation history" };
}

function number(value) {
  return Number(value || 0).toLocaleString();
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function FraudCheckModal({ order, onClose }) {
  const [result, setResult] = useState(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchResult = useCallback(async (forceRefresh = false) => {
    if (!order?.id) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setError("");
    forceRefresh ? setRefreshing(true) : setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${order.id}/courier-check`,
        forceRefresh ? { force_refresh: true } : {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data.data || EMPTY_RESULT);
    } catch (err) {
      const message = err.response?.data?.message || "Courier check failed.";
      setError(message);
      if (forceRefresh) toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [order?.id]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const summary = result.summary || EMPTY_RESULT.summary;
  const ratio = Number(summary.success_ratio || 0);
  const ratioState = ratioStyle(ratio, summary.total_parcel);

  return (
    <div className="fraud-modal-backdrop" onClick={onClose}>
      <div
        className="fraud-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="courier-check-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fraud-modal-header">
          <div>
            <h5 id="courier-check-title" className="mb-1">Courier History Check</h5>
            <div className="small text-muted">
              {order?.name || "Customer"} · {order?.phone || "No phone number"}
            </div>
          </div>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
        </div>

        <div className="fraud-modal-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" />
              <p className="text-muted mb-0">Checking courier history...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning mb-0">
              <strong>Unable to complete the check.</strong>
              <div className="mt-1">{error}</div>
            </div>
          ) : (
            <>
              <div className={`fraud-ratio-card ${ratioState.className}`}>
                <div>
                  <div className="fraud-ratio-label">Overall delivery success</div>
                  <div className="fraud-ratio-value">{ratio.toFixed(2)}%</div>
                  <div className="small">{ratioState.label}</div>
                </div>
                <div className="fraud-ratio-note">
                  This is courier delivery history, not a definitive fraud verdict.
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-4"><div className="fraud-stat"><span>Total</span><strong>{number(summary.total_parcel)}</strong></div></div>
                <div className="col-4"><div className="fraud-stat fraud-stat-success"><span>Delivered</span><strong>{number(summary.success_parcel)}</strong></div></div>
                <div className="col-4"><div className="fraud-stat fraud-stat-danger"><span>Cancelled</span><strong>{number(summary.cancelled_parcel)}</strong></div></div>
              </div>

              <h6 className="fraud-section-title">Courier breakdown</h6>
              {result.couriers?.length > 0 ? (
                <div className="row g-2 mb-4">
                  {result.couriers.map((courier) => (
                    <div className="col-12 col-md-6" key={courier.key}>
                      <div className="fraud-courier-card">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          {courier.logo && <img src={courier.logo} alt="" className="fraud-courier-logo" />}
                          <strong>{courier.name}</strong>
                          <span className="ms-auto fw-semibold">{Number(courier.success_ratio || 0).toFixed(2)}%</span>
                        </div>
                        <div className="small text-muted">
                          {number(courier.success_parcel)} delivered · {number(courier.cancelled_parcel)} cancelled · {number(courier.total_parcel)} total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="small text-muted mb-4">No courier-specific history was returned.</p>
              )}

              <h6 className="fraud-section-title">Merchant reports</h6>
              {result.reports?.length > 0 ? (
                <div className="fraud-reports-list">
                  {result.reports.map((report, index) => (
                    <div className="fraud-report-card" key={report.id || `${report.courier_name}-${index}`}>
                      <div className="d-flex align-items-center gap-2">
                        {report.courier_logo && <img src={report.courier_logo} alt="" className="fraud-courier-logo" />}
                        <strong>{report.courier_name}</strong>
                        <span className="ms-auto small text-muted">{formatDate(report.created_at)}</span>
                      </div>
                      <div className="small mt-2"><strong>{report.name}</strong>{report.details ? ` — ${report.details}` : ""}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="small text-muted mb-0">No merchant reports were returned.</p>
              )}
            </>
          )}
        </div>

        <div className="fraud-modal-footer">
          <span className="small text-muted">
            {result.meta?.checked_at ? `Checked ${formatDate(result.meta.checked_at)}${result.meta.cached ? " · cached" : ""}` : ""}
          </span>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => fetchResult(true)} disabled={loading || refreshing}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
