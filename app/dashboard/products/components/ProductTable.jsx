"use client";
import { useState, useEffect } from "react";
import DesktopTableView from "./DesktopTableView";
import MobileCardView from "./MobileCardView";
import VariantsModal from "./VariantsModal";

export default function ProductTable({ productData }) {
  const [products, setProducts] = useState(productData);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);

  // ✅ FIX — Update table whenever parent sends new data
  useEffect(() => {
    setProducts(productData);
  }, [productData]);

  const handleShowVariants = (product) => {
    setSelectedProduct(product);
    setShowVariantsModal(true);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <div className="d-none d-lg-block">
        <DesktopTableView 
          products={products} 
          onShowVariants={handleShowVariants}
          onDelete={handleDelete}
        />
      </div>

      <div className="d-block d-lg-none">
        <MobileCardView 
          products={products} 
          onShowVariants={handleShowVariants}
          onDelete={handleDelete}
        />
      </div>

      {showVariantsModal && selectedProduct && (
        <VariantsModal
          product={selectedProduct}
          onClose={() => setShowVariantsModal(false)}
        />
      )}
    </>
  );
}
