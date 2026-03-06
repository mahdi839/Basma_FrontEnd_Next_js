"use client";

function SizeFilter({ sizes, selected, onChange }) {
  return (
    <div className="spf-size-grid">
      {sizes.map(size => {
        const active = selected.includes(size.id);
        return (
          <button
            key={size.id}
            className={`spf-size-chip${active ? " active" : ""}`}
            onClick={() => onChange(size.id)}
          >
            {size.size}
          </button>
        );
      })}
    </div>
  );
}

export default SizeFilter;