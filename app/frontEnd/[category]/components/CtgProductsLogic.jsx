"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";
import ProductModal from "@/app/components/frontEnd/home/slots/components/ProductModal";
import { useRouter } from "next/navigation";
import CartDrawer from "@/app/components/frontEnd/components/CartDrawer";

export default function CtgProductsLogic({ products, category }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  // Open modal with product details
  function handleOpenModal(product) {
    setSelectedProduct(product);
    setSelectedSizes(""); // Reset selection when opening modal
    setIsModalOpen(true);
  }

  // Close modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSizes("");
  }

  // close drawer
  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleSizeSelect = useCallback((sizeId) => {
    setSelectedSizes(sizeId);
  }, []);

  function handleColorSelect(colorImage) {
    setSelectedColor(colorImage);
  }

  const handleAddToCart = useCallback(
    (product, type,preQty) => {
      let existingCart = cartItems.find(
        (existProduct) => existProduct.id === product.id
      );
      if (existingCart) {
        Swal.fire({
          title: "Already in the cart",
          text: "This product is already in your cart",
          icon: "info",
          confirmButtonText: "Ok",
          confirmButtonColor: "#DB3340",
        });
        return;
      }

      if (product.sizes.length > 1 && !selectedSizes) {
        Swal.fire({
          title: `Please Select A Size"}`,
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: "#DB3340",
        });
        return;
      }

      // Find the selected variant for price
      const selectedVariant = product.sizes.find(v => v.id == selectedSizes) || product.sizes[0];

      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          size: selectedSizes ? selectedVariant.id : "",
          price: selectedVariant?.pivot?.price ?? product.price,
          image: baseUrl + product.images?.[0]?.image || "",
          colorImage: selectedColor ? baseUrl + selectedColor : null,
          preQty: preQty ?? 1,
        })
      );

      setSelectedSizes(""); // Reset selection
      toast.success("Added to cart!");
      if (type === 'buy') {
        setIsCartDrawerOpen(true);
        setIsDirectBuy(true)
        handleCloseModal()
      }
    },
    [cartItems, dispatch, selectedSizes, baseUrl]
  );

  useEffect(() => {
    if (products) {
      setIsLoading(false);
    }
    if (products?.error) {
      toast.error(products.error);
    }
  }, [products]);

  // ✅ Now it's safe to return conditionally
  if (isLoading) {
    return <DynamicLoader />;
  }

  if (products?.error) {
    return <div className="text-center my-5">Error: {products.error}</div>;
  }

  if (!products?.length) {
    return <div className="text-center my-5 text-danger">No products found</div>;
  }

  return (
    <div className="container">
      <div className="row position-relative">
        {products?.map((product, index) => (
          <div className="col-6 col-lg-3 col-md-4 " key={product.id}>
            <ProductCard
              slotProducts={product}
              handleOpenModal={handleOpenModal}
              handleAddToCart={handleAddToCart}
            />
          </div>
        ))}

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedSizes={selectedSizes}
            onSizeSelect={handleSizeSelect}
            onSelectColor={handleColorSelect}
            selectedColor={selectedColor}
            onAddToCart={handleAddToCart}
            baseUrl={baseUrl}
          />
        )}

        <CartDrawer
          isOpen={isCartDrawerOpen}
          isDirectBuy={isDirectBuy}
          onClose={handleCloseDrawer}
        />
      </div>
    </div>
  );
}
