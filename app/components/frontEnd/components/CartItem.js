import React from "react";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

export default function CartItem({ 
  item, 
  onIncreament, 
  onDecreament, 
  onRemove, 
  removingItem,
  getSizeName,
  onClose 
}) {
  return (
    <div
      className={`cart-item ${removingItem === item.id ? 'removing' : ''}`}
    >
      <div className="item-image">
        <img
          src={item?.colorImage ?? item?.image}
          alt={item.title}
          className="img-fluid"
        />
      </div>
      <div className="item-details">
        <h6 className="item-title">
          <Link
            onClick={onClose}
            href={`/frontEnd/product-page/${item.id}`}
          >
            {item.title}
          </Link>
        </h6>
        {item.size && (
          <p className="item-variant">
            Variant: <span>{getSizeName(item.size)}</span>
          </p>
        )}

        <div className="item-actions">
          <div className="quantity-controls">
            <button
              onClick={() => onDecreament(item.id)}
              disabled={item.qty <= 1}
              className="qty-btn qty-minus"
              aria-label="Decrease quantity"
            >
              <FaMinus size={10} />
            </button>
            <span className="qty-display">{item.qty}</span>
            <button
              onClick={() => onIncreament(item.id)}
              className="qty-btn qty-plus"
              aria-label="Increase quantity"
            >
              <FaPlus size={10} />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="remove-btn"
            aria-label="Remove item"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      <div className="item-total">
        <span className="total-price">{item.totalPrice} TK</span>
      </div>
    </div>
  );
}
