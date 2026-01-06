"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import useStoreData from '@/app/hooks/useStoreData';
import React, { useState } from 'react'


export default function Page() {
    const [shippingType, setShippingType] = useState('');
    const [storeShipping, setStoreShipping] = useState({
        inside_dhaka: "",
        outside_dhaka: "",
        one_shipping_cost: ""
    });
    const { storeData, loading } = useStoreData()
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/shipping-costs"

    function handleShipping(e) {
        const { name, value } = e.target;
        setStoreShipping((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    async function submitShipping(e) {
        e.preventDefault();
        await storeData(url, storeShipping)
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Add Shipping Cost</h4>

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
                                    value={setStoreShipping.inside_dhaka}
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
                                    value={setStoreShipping.outside_dhaka}
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
                                value={setStoreShipping.one_shipping_cost}
                                onChange={handleShipping}

                            />
                        </div>
                    )}

                    <Button type="submit" className="btn btn-primary w-100 mt-3">
                        Add Shipping Cost
                    </Button>
                </form>
            </div>
        </div>
    )
}