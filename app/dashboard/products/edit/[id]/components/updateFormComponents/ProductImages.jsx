import React from "react";
import { FaChevronDown, FaChevronUp, FaImage, FaTrash, FaGripVertical } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------------------------------------
   Sortable Item
---------------------------------------------- */
function SortableImage({ image, baseUrl, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="position-relative">
      <div className="position-relative">
        <img
          src={`${baseUrl}${image.image}`}
          alt="Product"
          className="img-thumbnail w-100"
          style={{ height: "120px", objectFit: "cover" }}
        />

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="position-absolute top-0 start-0 m-1 bg-white rounded p-1"
          style={{ cursor: "grab" }}
          title="Drag to reorder"
        >
          <FaGripVertical />
        </div>

        {/* Delete */}
        <button
          type="button"
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
          onClick={() => onDelete(image.id)}
        >
          <FaTrash size={10} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   ProductImages Component
---------------------------------------------- */
export default function ProductImages({
  handleDeleteExistingImage,
  toggleSection,
  existingImages,
  isEditMode,
  handleImageUpload,
  formData,
  setFormData,
  expandedSections,
  baseUrl,
}) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFormData((s) => s); // keeps form dirty

    const oldIndex = existingImages.findIndex((i) => i.id === active.id);
    const newIndex = existingImages.findIndex((i) => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(existingImages, oldIndex, newIndex);
      setExistingImagesSafe(reordered);
    }
  };

  // helper to avoid mutating props
  const setExistingImagesSafe = (newImages) => {
    if (typeof window !== "undefined") {
      // parent owns this state; assume setter exists in scope
      window.dispatchEvent(
        new CustomEvent("update-existing-images", {
          detail: newImages,
        })
      );
    }
  };

  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div
        className="card-header bg-white border-0 py-3 cursor-pointer"
        onClick={() => toggleSection("images")}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="bg-opacity-10 p-2 rounded me-3">
              <FaImage size={22} className="text-info" />
            </div>
            <h5 className="mb-0 fw-semibold text-dark">Product Images</h5>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-info me-2">
              {existingImages.length + formData.images.length}
            </span>
            {expandedSections.images ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>

      <div className={`collapse ${expandedSections.images ? "show" : ""}`}>
        <div className="card-body pt-0">
          {/* Upload */}
          <label className="form-label fw-semibold text-gray-700">
            Upload Images {!isEditMode && <span className="text-danger">*</span>}
          </label>

          <div className="border-dashed rounded p-4 text-center bg-light mb-4">
            <FaImage className="fs-1 text-muted mb-3" />
            <input
              type="file"
              className="form-control d-none"
              id="imageUpload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label htmlFor="imageUpload" className="btn btn-outline-primary">
              Choose Files
            </label>
          </div>

          {/* Existing Images (Sortable) */}
          {existingImages.length > 0 && (
            <>
              <h6 className="fw-semibold mb-2">
                Existing Images (drag to reorder)
              </h6>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={existingImages.map((img) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="row g-2">
                    {existingImages.map((image) => (
                      <div key={image.id} className="col-6 col-md-3">
                        <SortableImage
                          image={image}
                          baseUrl={baseUrl}
                          onDelete={handleDeleteExistingImage}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}

          {/* New Images Preview */}
          {formData.images.length > 0 && (
            <>
              <h6 className="fw-semibold mt-4">New Images</h6>
              <div className="row g-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <div className="position-relative">
                      <img
                        src={URL.createObjectURL(image)}
                        className="img-thumbnail w-100"
                        style={{ height: "120px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => {
                          const next = formData.images.filter((_, i) => i !== index);
                          setFormData((s) => ({ ...s, images: next }));
                        }}
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
