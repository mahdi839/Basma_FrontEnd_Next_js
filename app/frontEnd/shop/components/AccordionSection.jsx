"use client";
import { useState } from "react";

function AccordionSection({ title, count = 0, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="spf-accordion">
      <button className="spf-accordion-trigger" onClick={() => setOpen(!open)}>
        <span className="spf-accordion-title">
          {title}
          {count > 0 && <span className="spf-acc-badge">{count}</span>}
        </span>
        <svg
          className={`spf-chevron${open ? " open" : ""}`}
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`spf-accordion-body${open ? " open" : ""}`}>
        <div className="spf-accordion-inner">{children}</div>
      </div>
    </div>
  );
}

export default AccordionSection;