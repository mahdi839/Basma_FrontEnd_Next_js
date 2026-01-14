"use client"

import Button from '@/app/components/dashboard/components/button/Button';
import useStoreData from '@/app/hooks/useStoreData';
import useUpdateData from '@/app/hooks/useUpdateData';
import useIndexData from '@/app/hooks/useIndexData';
import React, { useEffect, useState } from 'react'
import { FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Page() {
    const [shippingType, setShippingType] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const { storeData, loading: storeLoading } = useStoreData()
    const { updateData, loading: updateLoading } = useUpdateData()
    const { indexData, data, loading: indexLoading } = useIndexData()

    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/shipping-costs"

    const [shippingData, setShippingData] = useState({
        inside_dhaka: "",
        outside_dhaka: "",
        one_shipping_cost: ""
    });

    // Fetch existing shipping cost on component mount
    useEffect(() => {
        indexData(url);
    }, [])

    // Set form data when shipping cost data is loaded
    useEffect(() => {
        if (data && data.data && data.data.length > 0) {
            const existingData = data.data[0]; // Get first shipping cost
            setCurrentId(existingData.id);
            setIsEditMode(true);

            setShippingData({
                inside_dhaka: existingData.inside_dhaka || "",
                outside_dhaka: existingData.outside_dhaka || "",
                one_shipping_cost: existingData.one_shipping_cost || ""
            });

            // Set shipping type based on existing data
            if (existingData.one_shipping_cost) {
                setShippingType('one');
            } else if (existingData.inside_dhaka || existingData.outside_dhaka) {
                setShippingType('inside_outside');
            }
        }
    }, [data]);

    function handleShippingChange(e) {
        const { name, value } = e.target;
        setShippingData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    function handleShippingTypeChange(e) {
        const type = e.target.value;
        setShippingType(type);

        // Reset relevant fields when switching types
        if (type === 'one') {
            setShippingData(prev => ({
                ...prev,
                inside_dhaka: "",
                outside_dhaka: ""
            }));
        } else if (type === 'inside_outside') {
            setShippingData(prev => ({
                ...prev,
                one_shipping_cost: ""
            }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Validation
        if (!shippingType) {
            toast.error("Please select shipping type");
            return;
        }

        if (shippingType === 'inside_outside' && (!shippingData.inside_dhaka || !shippingData.outside_dhaka)) {
            toast.error("Please fill both Inside Dhaka and Outside Dhaka costs");
            return;
        }

        if (shippingType === 'one' && !shippingData.one_shipping_cost) {
            toast.error("Please enter shipping cost");
            return;
        }

        try {
            if (isEditMode && currentId) {
                // Update existing shipping cost
                const updateUrl = `${url}/${currentId}`;
                await updateData(updateUrl, shippingData);
                toast.success("Shipping cost updated successfully");
            } else {
                // Create new shipping cost
                await storeData(url, shippingData);
                toast.success("Shipping cost created successfully");
                // Refresh data to get the ID and switch to edit mode
                indexData(url);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    }

    const loading = indexLoading || storeLoading || updateLoading;

    if (indexLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg">
                        <div className=" text-center py-3 border-bottom">
                            <h5 className="card-title mb-0">
                                {isEditMode ? 'Update Shipping Cost' : 'Set Shipping Cost'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Shipping Type Selector */}
                                <div className="form-group mb-4">
                                    <label htmlFor="shippingType" className="form-label fw-bold">
                                        Shipping Type:
                                    </label>
                                    <div className="select-wrapper">
                                        <select
                                            className="form-control"
                                            id="shippingType"
                                            value={shippingType}
                                            onChange={handleShippingTypeChange}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="inside_outside">Inside/Outside Dhaka</option>
                                            <option value="one">One Shipping Cost</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Conditional Fields */}
                                {shippingType === 'inside_outside' && (
                                    <>
                                        <div className="form-group mb-3">
                                            <label htmlFor="insideDhaka" className="form-label fw-bold">
                                                Inside Dhaka Cost (৳):
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="insideDhaka"
                                                name="inside_dhaka"
                                                placeholder="Enter cost for Inside Dhaka"
                                                value={shippingData.inside_dhaka}
                                                onChange={handleShippingChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="outsideDhaka" className="form-label fw-bold">
                                                Outside Dhaka Cost (৳):
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="outsideDhaka"
                                                name="outside_dhaka"
                                                placeholder="Enter cost for Outside Dhaka"
                                                value={shippingData.outside_dhaka}
                                                onChange={handleShippingChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {shippingType === 'one' && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="oneShipping" className="form-label fw-bold">
                                            Shipping Cost (৳) - Applicable For All Districts:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="oneShipping"
                                            name="one_shipping_cost"
                                            placeholder="Enter shipping cost for all districts"
                                            value={shippingData.one_shipping_cost}
                                            onChange={handleShippingChange}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-3 py-2 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="spinner-border spinner-border-sm me-2" />
                                            {isEditMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        isEditMode ? 'Update Shipping Cost' : 'Set Shipping Cost'
                                    )}
                                </Button>

                                {isEditMode && (
                                    <div className="alert alert-info mt-3 mb-0 text-center">
                                        <small>
                                            <i className="fas fa-info-circle me-1"></i>
                                            Shipping cost is already set. You can update any values including the shipping type.
                                        </small>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}