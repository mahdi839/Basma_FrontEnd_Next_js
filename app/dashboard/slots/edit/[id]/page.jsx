'use client'
import useGetSingleData from '@/app/hooks/useGetSingleData';
import useIndexData from '@/app/hooks/useIndexData';
import useUpdateData from '@/app/hooks/useUpdateData';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function page() {
    
    const {id} = useParams()
      const [selectedProducts, setSelectedProducts] = useState([]);
      const [productInput, setProductInput] = useState('');
      const [slotName, setSlotName] = useState('');
       const [priority, setPriority] = useState(1);
     const router = useRouter();
    
    
      const handleAddProduct = () => {
        if (productInput && !selectedProducts.includes(productInput)) {
          setSelectedProducts([...selectedProducts, productInput]);
          setProductInput('');
        }
      };
    

      const handleRemoveProduct = (index) => {
        const updated = [...selectedProducts];
        updated.splice(index, 1);
        setSelectedProducts(updated);
      };

       // Find category name by ID

  // Find product name by ID
  const getProductName = (id) => {
    const product = data?.data?.products?.find(prod => prod.id == id);
    return product ? product.title : `Product (ID: ${id})`;
  };
    const {fetchSingleData, data:singleData, loading:singleLoading, error } = useGetSingleData();
    const {indexData,loading,data,setData} = useIndexData();
       const ProductsUrl = process.env.BACKEND_URL + `api/slots_products/create`;
       const singleDataUrl = process.env.BACKEND_URL + `api/product-slots/edit/${id}`;
       useEffect(()=>{
          indexData(ProductsUrl)
          fetchSingleData(singleDataUrl)
         
         
       },[])

       useEffect(() => {
      

        if (singleData?.data?.slot_details) {
            const products = singleData.data.slot_details
              .filter(slotD => slotD?.product)
              .map(slotD => ({
                productInput: slotD.product.id, // use ID, not name, for input!
              }));
        
            setSelectedProducts(products);
          }
      
        if (singleData?.data) {
            setSlotName(singleData.data.slot_name || '');
            setPriority(singleData.data.priority || 1);
          }
      }, [singleData]);

  
  function handleCancel (e){
      
    setProductInput('')
    setSelectedProducts([]);
  
  }


  
   const {updateData} = useUpdateData()
   function handleSubmit (e){
      e.preventDefault();
    const payload = {
      slot_name: slotName,
      priority,
      product_id:  selectedProducts.map(Number) ,
    };
    const updateUrl = process.env.BACKEND_URL + `api/product-slots/${id}`;
    const redirectUrl = '/dashboard/slots';
    updateData(updateUrl, payload, "Slot updated successfully",redirectUrl);
   
    setProductInput('')

    setSelectedProducts([]);
    setSlotName('');
    setPriority(1);
    handleCancel()
    // Redirect to slots index page after successful update
   
   }
    
  return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg rounded-3 border-0 w-100" style={{ maxWidth: '800px' }}>
        <div className="card-header  text-white py-3 rounded-top-3" style={{background:'#7d59bf'}}>
          <h5 className="mb-0 text-center">Edit  Slot</h5>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Slot Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="slotName"
                    placeholder="e.g. Featured Products"
                    name='slot_name'
                    value={slotName}
                    onChange={(e) => setSlotName(e.target.value)}
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
                    name='priority'
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  />
                  <label htmlFor="priority" className="text-muted">
                    Priority (Lower = Higher)
                  </label>
                </div>
              </div>
           
              
              
            
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
                            data?.data?.products?.map((product)=>(
                                <option value={product.id} >{product.title}</option>
                            ))
                        }
                      </select>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleAddProduct}
                      >
                        Save
                      </button>
                    </div>
                    
                    <div className="mt-3">
                      {selectedProducts.map((productId, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between bg-light p-3 mb-2 rounded-2 shadow-sm">
                          <div className="d-flex align-items-center">
                            <span className="badge bg-info me-2">
                              {index + 1}
                            </span>
                            <span className="fw-medium">{getProductName(productId)}</span>
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
           
            </div>
            
            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top">
              <div className="d-flex gap-2 justify-content-center">
                <button className='dashboard-cancel-btn' type="button" onClick={handleCancel} >
                  Cancel
                </button>
                <button 
                    type="submit" 
                    className="dashboard-btn" 
                    // disabled={isStoring}
                >
                    Save Slot
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
