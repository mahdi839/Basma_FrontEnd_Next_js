"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getData } from "@/lib/api";
export default function Page() {
    const [ size,setSize] = useState("");
    const [ loading,setLoading] = useState(false);
    const router = useRouter();
   
   async function storeSize (e){
           e.preventDefault();
           setLoading(true)
          try{
            let res =  await axios.post("http://127.0.0.1:8000/api/sizes",{
                size:size
               })
               toast.success("successfully added")
               window.location.href = "/dashboard/sizes"
          }catch(err){
                toast.error(err.response?.data?.message || "an error occured")      
          }finally{
            setLoading(false)
          }
    } 

    
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h4 className="text-center mb-4">Add Size</h4>
        
        <form onSubmit={storeSize}>
          <div className="form-group">
            <label htmlFor="size" className="fw-bold">Size:</label>
            <input type="text" className="form-control" id="size" name="size" placeholder="Enter size" onChange={(e)=>setSize(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">{loading ? "Adding..." : "Add Size"}</button>
        </form>
      </div>
    </div>
  );
}
