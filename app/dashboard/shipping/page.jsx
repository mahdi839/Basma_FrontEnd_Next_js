"use client"
import Button from '@/app/components/dashboard/components/button/Button';
import React, { useState } from 'react'

export default function Page() {
    const [shippingType, setShippingType] = useState('');
    const [insideDhaka, setInsideDhaka] = useState('');
    const [outsideDhaka, setOutsideDhaka] = useState('');
    const [oneShipping, setOneShipping] = useState('');

    function storeShipping(e) {
        e.preventDefault();
        
        // Handle form submission based on selected type
        if (shippingType === 'inside_outside') {
            console.log('Inside Dhaka:', insideDhaka);
            console.log('Outside Dhaka:', outsideDhaka);
            // Submit both values
        } else if (shippingType === 'one') {
            console.log('One Shipping Cost:', oneShipping);
            // Submit single value
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h4 className="text-center mb-4">Add Shipping Cost</h4>

                <form onSubmit={storeShipping}>
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
                                    placeholder="Enter cost for Inside Dhaka"
                                    value={insideDhaka}
                                    onChange={(e) => setInsideDhaka(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="outsideDhaka" className="fw-bold">Outside Dhaka Cost:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="outsideDhaka"
                                    placeholder="Enter cost for Outside Dhaka"
                                    value={outsideDhaka}
                                    onChange={(e) => setOutsideDhaka(e.target.value)}
                                    required
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
                                placeholder="Enter shipping cost"
                                value={oneShipping}
                                onChange={(e) => setOneShipping(e.target.value)}
                                required
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