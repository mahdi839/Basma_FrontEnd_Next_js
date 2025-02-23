"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductUploadForm() {
  const [sizes, setSizes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    sub_title: '',
    video_url: '',
    description: '',
    discount: '',
    images: [],
    sizes: [],
    faqs: [],
  });

  // Fetch available sizes
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/sizes');
        setSizes(response.data);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };
    fetchSizes();
  }, []);

  // Handle dynamic size fields
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'price' ? Number(value) : value
    };
    setFormData({ ...formData, sizes: newSizes });
  };

  // Handle dynamic FAQ fields
  const handleFAQChange = (index, field, value) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData({ ...formData, faqs: newFAQs });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('sub_title', formData.sub_title);
    data.append('video_url', formData.video_url);
    data.append('description', formData.description);
    data.append('discount', formData.discount);
    
    formData.images.forEach((image) => {
      data.append('image', image); // Changed to 'image' instead of 'image[]'
    });
    
    formData.sizes.forEach((size, index) => {
      data.append(`sizes[${index}][size_id]`, size.size_id);
      data.append(`sizes[${index}][price]`, size.price.toString());
    });
    
    formData.faqs.forEach((faq, index) => {
      data.append(`question[${index}]`, faq.question);
      data.append(`answer[${index}]`, faq.answer);
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/products', data);
      alert('Product created successfully!');
      // Reset form
      setFormData({
        title: '',
        sub_title: '',
        video_url: '',
        description: '',
        discount: '',
        images: [],
        sizes: [],
        faqs: [],
      });
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Create New Product</h3>
       
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="card mb-4">
          <div className="card-header">Basic Information</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title <span className='text-danger'>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sub Title<span className='text-danger'>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.sub_title}
                  onChange={(e) => setFormData({ ...formData, sub_title: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="card mb-4">
          <div className="card-header">Media</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Product Images<span className='text-danger'>*</span></label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              <div className="mt-2">
                {formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="img-thumbnail me-2"
                    max={3}
                    style={{ width: '100px', height: '100px' }}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Video URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Sizes and Pricing */}
        <div className="card mb-4">
          <div className="card-header">Sizes & Pricing</div>
          <div className="card-body">
            {formData.sizes.map((size, index) => (
              <div key={index} className="row g-3 mb-3">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={size.size_id}
                    onChange={(e) => handleSizeChange(index, 'size_id', e.target.value)}
                    required
                  >
                    <option  value="">Select Size</option>
                    {sizes.map((size) => (
                      <option  key={size.id} value={size.id}>
                        {size.size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      const newSizes = [...formData.sizes];
                      newSizes.splice(index, 1);
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, { size_id: '', price: 0 }] })}
            >
              Add Size
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="card mb-4">
          <div className="card-header">FAQs</div>
          <div className="card-body">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="row g-3 mb-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      const newFAQs = [...formData.faqs];
                      newFAQs.splice(index, 1);
                      setFormData({ ...formData, faqs: newFAQs });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] })}
            >
              Add FAQ
            </button>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-lg my-3">
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}