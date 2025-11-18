"use client";
import { useState } from "react";
import DesktopTableView from "./DesktopTableView";
import MobileCardView from "./MobileCardView";
import VariantsModal from "./VariantsModal";

export default function ProductTable({ productData }) {
  const [products, setProducts] = useState(productData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);

  const handleShowVariants = (product) => {
    setSelectedProduct(product);
    setShowVariantsModal(true);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  console.log(productData)
  return (
    <>
      {/* Desktop Table View */}
      <div className="d-none d-lg-block">
        <DesktopTableView 
          products={products} 
          onShowVariants={handleShowVariants}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="d-block d-lg-none">
        <MobileCardView 
          products={products} 
          onShowVariants={handleShowVariants}
          onDelete={handleDelete}
        />
      </div>

      {/* Variants Modal */}
      {showVariantsModal && selectedProduct && (
        <VariantsModal
          product={selectedProduct}
          onClose={() => setShowVariantsModal(false)}
        />
      )}
    </>
  );
}