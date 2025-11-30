"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import ProductCard from "../../components/frontEnd/home/slots/components/ProductCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ProductModal from "@/app/components/frontEnd/home/slots/components/ProductModal";
import CartDrawer from "@/app/components/frontEnd/components/CartDrawer";

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    min_price: '',
    max_price: '',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    sizes: [],
    price_range: { min: 0, max: 1000 }
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    has_more: false,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${baseUrl}api/shop/filters`);
      const data = await response.json();
      if (data.message === 'success') {
        setFilterOptions(data.data);
        // Set initial price range
        setFilters(prev => ({
          ...prev,
          min_price: data.data.price_range.min,
          max_price: data.data.price_range.max
        }));
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Fetch products with current filters
  const fetchProducts = useCallback(async (page = 1, append = false) => {
    const loadingState = page === 1 ? setLoading : setLoadingMore;
    loadingState(true);

    try {
      const params = new URLSearchParams();
      params.append('page', page);
      
      if (filters.categories.length > 0) {
        filters.categories.forEach(cat => params.append('categories[]', cat));
      }
      if (filters.sizes.length > 0) {
        filters.sizes.forEach(size => params.append('sizes[]', size));
      }
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`${baseUrl}api/shop/products?${params}`);
      const data = await response.json();

      if (data.message === 'success') {
        if (append) {
          setProducts(prev => [...prev, ...data.data]);
        } else {
          setProducts(data.data);
        }
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      loadingState(false);
    }
  }, [filters, baseUrl]);

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (filterOptions.categories.length > 0) {
      fetchProducts(1, false);
    }
  }, [filters, fetchProducts, filterOptions]);

  // Filter handlers
  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSizeChange = (sizeId) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(sizeId)
        ? prev.sizes.filter(id => id !== sizeId)
        : [...prev.sizes, sizeId]
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      min_price: min,
      max_price: max
    }));
  };

  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      min_price: filterOptions.price_range.min,
      max_price: filterOptions.price_range.max,
      search: ''
    });
  };

  // Load more products
  const loadMore = () => {
    if (pagination.has_more) {
      fetchProducts(pagination.current_page + 1, true);
    }
  };

  // Product modal and cart functions (from your example)
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSizes("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSizes("");
  };

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSizes(sizeId);
  };

  const handleColorSelect = (colorImage) => {
    setSelectedColor(colorImage);
  };

  const handleAddToCart = (product, type, preQty) => {
    const targetProduct = selectedProduct || product;

    let existingCart = cartItems.find(
      (existProduct) => existProduct.id === targetProduct.id
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

    if (targetProduct.sizes.length > 1 && !selectedSizes) {
      Swal.fire({
        title: `Please Select A Size}`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const selectedVariant = targetProduct.sizes.find(v => v.id == selectedSizes) || targetProduct.sizes[0];
    dispatch(
      addToCart({
        id: targetProduct.id,
        title: targetProduct.title,
        size: selectedSizes ? selectedVariant.id : "",
        price: selectedVariant?.pivot.price ?? targetProduct.price,
        image: baseUrl + targetProduct.images?.[0]?.image || "",
        colorImage: baseUrl + selectedColor ?? "",
        preQty: preQty ?? 1,
      })
    );

    setSelectedSizes("");
    if (type == 'buy') {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true)
    }
    handleCloseModal();
    toast.success("Added to cart!");
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Filters</h5>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Categories</label>
                <div className="filter-options">
                  {filterOptions.categories.map(category => (
                    <div key={category.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        id={`category-${category.id}`}
                      />
                      <label className="form-check-label" htmlFor={`category-${category.id}`}>
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Sizes</label>
                <div className="filter-options">
                  {filterOptions.sizes.map(size => (
                    <div key={size.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filters.sizes.includes(size.id)}
                        onChange={() => handleSizeChange(size.id)}
                        id={`size-${size.id}`}
                      />
                      <label className="form-check-label" htmlFor={`size-${size.id}`}>
                        {size.size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Price Range: ৳{filters.min_price} - ৳{filters.max_price}
                </label>
                <div className="row g-2">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.min_price}
                      onChange={(e) => handlePriceChange(e.target.value, filters.max_price)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.max_price}
                      onChange={(e) => handlePriceChange(filters.min_price, e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9 col-md-8">
          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">Shop Products</h4>
              <small className="text-muted">
                Showing {products.length} of {pagination.total} products
              </small>
            </div>
            <div>
              {loading && (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-5">
              <h5>No products found</h5>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="row">
                {products.map((product, index) => (
                  <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                    <ProductCard
                      slotProducts={product}
                      handleOpenModal={handleOpenModal}
                      handleAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {pagination.has_more && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary px-5"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedSizes={selectedSizes}
          onSizeSelect={handleSizeSelect}
          onAddToCart={handleAddToCart}
          onSelectColor={handleColorSelect}
          selectedColor={selectedColor}
          baseUrl={baseUrl}
        />
      )}

      <CartDrawer
        isOpen={isCartDrawerOpen}
        isDirectBuy={isDirectBuy}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default ShopPage;