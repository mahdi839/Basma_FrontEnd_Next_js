import { FaListUl } from "react-icons/fa";

export default function ProductSpecifications({ specifications, onShowSpecifications }) {
  if (!specifications || specifications.length === 0) {
    return <span className="text-muted">-</span>;
  }

  return (
    <button
      className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
      onClick={onShowSpecifications}
      title="View specifications"
    >
      <FaListUl />
      <span>{specifications.length}</span>
    </button>
  );
}