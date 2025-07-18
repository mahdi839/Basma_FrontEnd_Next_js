'use client'
import useIndexData from "@/app/hooks/useIndexData";
import React, { useEffect, useState } from "react";

export default function page() {
    const [formData,setFormData] = useState({
        'link':'',
        'type':'',
        'category_id':'',
        'images':[]
    })

   const {indexData,loading,data,setData,} = useIndexData();
   const categoryIndeUrl = process.env.BACKEND_URL + `api/categories`;
   useEffect(()=>{
    indexData(categoryIndeUrl);
   },[])

   console.log(data)
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="card-header  text-white py-3 rounded-top-3"
          style={{ background: "#7d59bf" }}
        >
          <h5 className="mb-0 text-center">Add Banner Images</h5>
        </div>

        <div className="card-body p-4">
          <form >
            <div className="row g-4">
              {/* Slot Name */}
              <div className="col-md-6">
                <div className="">
                  <select
                  name="type"
                    className="form-select border-secondary"
                    value={formData.type}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                      <option value='hero'>Hero Section</option>
                      <option value='slot'>Slot</option>
                      <option value='category'>Category</option>
                  </select>
                  
                </div>
              </div>

              <div className="col-md-6">
                <div className="">
                  <select
                    className="form-select border-secondary"
                    name="category_id"
                    value={formData.category_id}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {
                      data?.data?.map((category)=>(
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    }
                      
                  </select>
                  
                </div>
              </div>
             {/* images */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="file"
                    className="form-control border-secondary"
                    id="images"
                    placeholder="Select Image"
                    name="images"
                    value={formData.images}
                    required
                  />
                </div>
              </div>

              {/* links */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="link"
                    placeholder="Give link"
                    name="link"
                    value={formData.link}
                    required
                  />
                </div>

                
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top">
              <div className="d-flex gap-2 justify-content-center">
                <button type="submit" className="dashboard-btn">
                  Save 
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
