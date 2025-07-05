'use client'
import Button from '@/app/components/dashboard/components/button/Button';
import useIndexData from '@/app/hooks/useIndexData';
import React, { useEffect, useState } from 'react';

export default function SlotForm() {
  const [slotType, setSlotType] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const handleAddCategory = () => {
    if (categoryInput && !selectedCategories.includes(categoryInput)) {
      setSelectedCategories([...selectedCategories, categoryInput]);
      setCategoryInput('');
    }
  };

  const handleAddProduct = () => {
    if (productInput && !selectedProducts.includes(productInput)) {
      setSelectedProducts([...selectedProducts, productInput]);
      setProductInput('');
    }
  };

  const handleRemoveCategory = (index) => {
    const updated = [...selectedCategories];
    updated.splice(index, 1);
    setSelectedCategories(updated);
  };

  const handleRemoveProduct = (index) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };
   
    const {indexData,loading,data,setData} = useIndexData();
     const ProductsUrl = process.env.BACKEND_URL + `api/products`;
     useEffect(()=>{
        indexData(ProductsUrl)
     },[])
  
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg rounded-3 border-0 w-100" style={{ maxWidth: '800px' }}>
        <div className="card-header  text-white py-3 rounded-top-3" style={{background:'#7d59bf'}}>
          <h5 className="mb-0 text-center">Create  Slot</h5>
        </div>
        
        <div className="card-body p-4">
          <form>
            <div className="row g-4">
              {/* Slot Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="slotName"
                    placeholder="e.g. Featured Products"
                    required
                  />
                  <label htmlFor="slotName" className="text-muted">
                    Slot Name
                  </label>
                </div>
              </div>
              
              {/* Priority */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control border-secondary"
                    id="priority"
                    placeholder="e.g. 1"
                    min="1"
                    required
                  />
                  <label htmlFor="priority" className="text-muted">
                    Priority (Lower = Higher)
                  </label>
                </div>
              </div>
              
              {/* Slot Type */}
              <div className="col-12">
                <label className="form-label fw-medium text-primary">
                  Slot Type
                </label>
                <div className="d-flex gap-3">
                  {['category', 'manual'].map((type) => (
                    <div key={type} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="slotType"
                        id={type}
                        checked={slotType === type}
                        onChange={() => setSlotType(type)}
                      />
                      <label className="form-check-label text-capitalize" htmlFor={type}>
                        {type === 'category' ? 'Category' : 'Manual Product'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Category Selection */}
              {slotType === 'category' && (
                <div className="col-12">
                  <div className="border rounded-3 p-3 shadow-sm">
                    <label className="form-label fw-medium text-primary mb-3">
                      Add Categories
                    </label>
                    
                    <div className="input-group mb-3">
                      <select 
                        className="form-select border-secondary"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                      >
                        <option value="" disabled>Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Sports">Sports</option>
                      </select>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleAddCategory}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="mt-3">
                      {selectedCategories.map((category, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between bg-light p-3 mb-2 rounded-2 shadow-sm">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-info me-2">
                              {index + 1}
                            </span>
                            <span className="fw-medium">{category}</span>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveCategory(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Product Selection */}
              {slotType === 'manual' && (
                <div className="col-12">
                  <div className="border rounded-3 p-3 shadow-sm">
                    <label className="form-label fw-medium text-primary mb-3">
                      Add Products
                    </label>
                    
                    <div className="input-group mb-3">
                      <select 
                        className="form-select border-secondary"
                        value={productInput}
                        onChange={(e) => setProductInput(e.target.value)}
                      >
                        <option value="" disabled>Select product</option>
                        {
                            data.data.map((product)=>(
                                <option value={product.id} >{product.title}</option>
                            ))
                        }
                    
                        
                      </select>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleAddProduct}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="mt-3">
                      {selectedProducts.map((product, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between bg-light p-3 mb-2 rounded-2 shadow-sm">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-info me-2">
                              {index + 1}
                            </span>
                            <span className="fw-medium">{product}</span>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top">
              <div className="d-flex gap-2 justify-content-center">
                <Button type="button"  >
                  Cancel
                </Button>
                <Button type="submit" className=" px-4">
                  Save Slot
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}