"use client"
import { getData } from '@/lib/api';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default  function page() {
    const [data, setData] = useState({size:""})
    const route = useRouter();
    const params = useParams();
    const {id} = params;
   useEffect(()=>{
       
    async function fetchSize() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/sizes/${id}`);
          setData(response.data); // Set the actual data
        } catch (err) {
          toast.error("Failed to fetch size data");
        } 
      }
  
      if (id) fetchSize();
   },[id])

    
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="card shadow-lg p-4" style={{ width: "400px" }}>
      <h4 className="text-center mb-4">Update Size ({id})</h4>
      
      <form >
        <div className="form-group">
          <label htmlFor="size" className="fw-bold">Size:</label>
          <input type="text" className="form-control" id="size" name="size" placeholder="Enter size" value={data?.size} />
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">Update</button>
      </form>
    </div>
  </div>
  )
}
