"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import useGetSingleData from '@/app/hooks/useGetSingleData';
import useUpdateData from '@/app/hooks/useUpdateData';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';


export default function Page() {
    const [shippingType, setShippingType] = useState('');
    const { fetchSingleData, data, loading } = useGetSingleData()
    const [storeShipping, setStoreShipping] = useState({
        inside_dhaka: "",
        outside_dhaka: "",
        one_shipping_cost: ""
    });
    const params = useParams();
    const id = params.id
    const { updateData } = useUpdateData()

    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/shipping-costs/${id}`

    useEffect(() => {
        fetchSingleData(url)
    }, [id])
    // Update state when data loads
    useEffect(() => {
        if (data) {
            setStoreShipping({
                inside_dhaka: data.inside_dhaka || "",
                outside_dhaka: data.outside_dhaka || "",
                one_shipping_cost: data.one_shipping_cost || ""
            });

            // Set shipping type based on existing data
            if (data.one_shipping_cost) {
                setShippingType('one');
            } else if (data.inside_dhaka || data.outside_dhaka) {
                setShippingType('inside_outside');
            }
        }
    }, [data]);
    function handleShipping(e) {
        const { name, value } = e.target;
        setStoreShipping((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    async function submitShipping(e) {
        e.preventDefault();
        await updateData(url, storeShipping)
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Update Shipping Cost</h4>

                <form onSubmit={submitShipping}>
                    {/* Shipping Type Selector */}
                    <div className="form-group mb-3">
                        <label htmlFor="shippingType" className="fw-bold">Shipping Type:</label>
                        <select
                            className="form-control"
                            id="shippingType"
                            value={shippingType}
                            onChange={(e) => setShippingType(e.target.value)}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="inside_outside">Inside/Outside Dhaka</option>
                            <option value="one">One Shipping</option>
                        </select>
                    </div>

                    {/* Conditional Fields */}
                    {shippingType === 'inside_outside' && (
                        <>
                            <div className="form-group mb-3">
                                <label htmlFor="insideDhaka" className="fw-bold">Inside Dhaka Cost:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="insideDhaka"
                                    name='inside_dhaka'
                                    placeholder="Enter cost for Inside Dhaka"
                                    value={storeShipping.inside_dhaka ?? ""}
                                    onChange={handleShipping}

                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="outsideDhaka" className="fw-bold">Outside Dhaka Cost:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="outsideDhaka"
                                    name='outside_dhaka'
                                    placeholder="Enter cost for Outside Dhaka"
                                    value={storeShipping.outside_dhaka ?? ""}
                                    onChange={handleShipping}

                                />
                            </div>
                        </>
                    )}

                    {shippingType === 'one' && (
                        <div className="form-group mb-3">
                            <label htmlFor="oneShipping" className="fw-bold">Shipping Cost: (Applicable For All District)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="oneShipping"
                                name='one_shipping_cost'
                                placeholder="Enter shipping cost"
                                value={storeShipping.one_shipping_cost ?? ""}
                                onChange={handleShipping}

                            />
                        </div>
                    )}

                    <Button type="submit" className="btn btn-primary w-100 mt-3">
                        Update Shipping Cost
                    </Button>
                </form>
            </div>
        </div>
    )
}