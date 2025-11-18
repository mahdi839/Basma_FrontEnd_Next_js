export default function ProductCategories({ categories }) {
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!categories || categories.length === 0) {
    return <span className="text-muted small">No categories</span>;
  }

  return (
    <div className="d-flex flex-column gap-1">
      {categories.slice(0, 3).map((category) => (
        <span 
          key={category.id} 
          className="badge bg-info text-white small" 
          style={{ width: 'fit-content' }}
        >
          {truncateText(category.name, 20)}
        </span>
      ))}
      {categories.length > 3 && (
        <small className="text-muted">+{categories.length - 3} more</small>
      )}
    </div>
  );
}