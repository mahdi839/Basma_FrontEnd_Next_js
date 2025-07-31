import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export default function useUpdateData() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [errors, setErrors] = useState({});
    
    const updateData = async (url, data, successMsg, redirectUrl) => {
        const token = localStorage.getItem('token')
        setLoading(true)
        
        try {
            // Use POST method with _method override for FormData with files
            if (data instanceof FormData) {
                data.append('_method', 'PUT');
                
                await axios.post(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Use PUT for regular JSON data
                await axios.put(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            Swal.fire({
                title: successMsg,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            router.push(redirectUrl);
            
        } catch (err) {
            if (err.response?.status === 422) {
                // Laravel validation errors
                setErrors(err.response.data.errors);
                
                // Show general error in toast
                const firstError = Object.values(err.response.data.errors)[0][0];
                Swal.fire({
                    'title': 'Oops! Please Check',
                    'text': firstError,
                    'icon': 'error'
                })
                
            } else {
                const errorMessage =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    err.message;
                
                Swal.fire({
                    'title': 'Oops! Please Check',
                    'text': errorMessage,
                    'icon': 'error'
                })
            }
        } finally {
            setLoading(false)
        }
    }
    
    return { updateData, loading, errors }
}