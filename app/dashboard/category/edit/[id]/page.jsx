"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function page({ params }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    let { id } = params;
    const url = process.env.BACKEND_URL + `api/categories/${id}`
    const token = localStorage.getItem("token")
    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await axios.get(url)
                setData(res.data)
            } catch (err) {
                toast.error(err.message)
            }

        }
        if (id) fetchCategory()
    }, [id])
    console.log(data)
    function handleChange (e){
      setData({...data, name: e.target.value})
    }
    async function editCategory (e){
        e.preventDefault()
        setIsLoading(true)
        try{
            const res = await axios.put(url,{name: data.name},{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            toast.success("Updated Successfully!")
            window.location.href = "/dashboard/category"
        }catch(err){
            toast.error(err.message)
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Update Category ({id})</h4>

                <form onSubmit={editCategory}>
                    <div className="form-group">
                        <label htmlFor="size" className="fw-bold">Category:</label>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter size" value={data?.name} onChange={handleChange} />
                    </div>
                    <Button type="submit" className=" btn-primary w-100 mt-3"> {isLoading ? "...Updating" : "Update"} </Button>
                </form>
            </div>
        </div>
    )
}
