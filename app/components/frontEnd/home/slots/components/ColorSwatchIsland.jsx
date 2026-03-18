"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ColorSwatchIsland({
  productId,
  productTitle,
  firstImage,
  colors,
  baseUrl,
}) {
  const [selected, setSelected] = useState({ url: null, index: null });

  const displaySrc = selected.url ? `${baseUrl}${selected.url}` : firstImage;

  function handleClick(index, colorImage) {
    setSelected((prev) =>
      prev.index === index ? { url: null, index: null } : { url: colorImage, index }
    );
  }

  return (
    <>
      {/* order:0 — hero image, visually first */}
      <Link
        href={`/frontEnd/product-page/${productId}`}
        style={{ textDecoration: "none", order: 0 }}
      >
        <div className="position-relative overflow-hidden product-image-container">
          <Image
            width={500}
            height={400}
            src={displaySrc}
            className="product-image p-0 p-md-3"
            alt={productTitle || "Product"}
            priority={false}
          />
        </div>
      </Link>

      {/* order:3 — swatch row, visually AFTER the price block (order:2) */}
      {colors.length > 0 && (
        <div
          className="d-flex align-items-center gap-2 px-2 px-md-3 mt-1 mt-lg-2 pb-2"
          style={{ order: 3 }}
        >
          <div className="product-color-wrapper d-flex gap-2">
            {colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={
                  selected.index === index
                    ? "SelectedImageStyle"
                    : "product_color_image_div"
                }
                onClick={() => handleClick(index, color?.image)}
              >
                <Image
                  width={30}
                  height={30}
                  src={`${baseUrl}${color?.image}`}
                  alt={productTitle || "Color variant"}
                  className="h-100 w-100"
                />
              </div>
            ))}
          </div>

          {colors.length > 3 && (
            <small className="text-muted">+{colors.length - 3}</small>
          )}
        </div>
      )}
    </>
  );
}