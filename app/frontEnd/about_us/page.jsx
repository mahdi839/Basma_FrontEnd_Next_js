// app/about-us/page.jsx
import React from "react";
import { getData } from "@/lib/api"; // your API boilerplate

// Server component since we are doing SSR
export default async function AboutUsPage() {
  // Fetch About Us data from API
  const aboutUs = await getData("api/about-us");

  if (!aboutUs) {
    return (
      <div className="text-center mt-5">
        <p>Failed to load About Us content.</p>
      </div>
    );
  }

  return (
    <div className="container  my-5">
      <h4
        className="mb-4"
        style={{
          borderBottom: "2px solid #000",
          display: "inline-block",
          paddingBottom: "4px",
        }}
      >
        {aboutUs.title}
      </h4>

      {aboutUs.image && (
        <div className="d-flex justify-content-center mb-4">
          <img
            src={`${process.env.BACKEND_URL}storage/${aboutUs.image}`}
            alt={aboutUs.title}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
      )}
      <div
        className="about-content"
        dangerouslySetInnerHTML={{ __html: aboutUs.content }}
      ></div>
    </div>
  );
}
