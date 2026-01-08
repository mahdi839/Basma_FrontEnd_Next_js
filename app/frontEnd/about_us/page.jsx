// app/about-us/page.jsx
import React from "react";
import { getData } from "@/lib/api";
import Image from "next/image";

export default async function AboutUsPage() {
  const aboutUs = await getData("api/about-us");

  if (!aboutUs) {
    return (
      <div className="container my-5 py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading About Us content...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero bg-light py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4 text-gray">{aboutUs.title}</h1>
              <p className="lead text-muted">{aboutUs.excerpt}</p>
            </div>
            {aboutUs.image && (
              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className="about-image-container position-relative">
                  <p className="text-danger">Image URL: {`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${aboutUs.image}`}</p>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${aboutUs.image}`}
                    alt={aboutUs.title}
                    width={800}
                    height={400}
                    className="img-fluid rounded shadow-lg"
                    style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="about-content fs-5 lh-lg"
                dangerouslySetInnerHTML={{ __html: aboutUs?.content ?? "" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (if available) */}
      {/* {aboutUs.team && aboutUs.team.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center mb-5">Our Team</h2>
            <div className="row">
              {aboutUs.team.map((member, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${member.image}`}
                      className="card-img-top"
                      alt={member.name}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{member.name}</h5>
                      <p className="card-text text-muted">{member.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Values Section (if available) */}
      {/* {aboutUs.values && aboutUs.values.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5">Our Values</h2>
            <div className="row">
              {aboutUs.values.map((value, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="text-center px-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{ width: "70px", height: "70px" }}>
                      <i className={`fs-4 ${value.icon || "bi bi-star-fill"}`}></i>
                    </div>
                    <h4 className="h5">{value.title}</h4>
                    <p className="text-muted">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Call to Action */}
      {/* <section className="bg-primary py-5">
        <div className="container text-center text-white py-4">
          <h2 className="mb-4">Ready to work with us?</h2>
          <p className="mb-4 fs-5">Get in touch with our team to learn more about our services</p>
          <a href="/contact" className="btn btn-light btn-lg px-4">
            Contact Us
          </a>
        </div>
      </section> */}
    </div>
  );
}