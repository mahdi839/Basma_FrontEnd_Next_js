import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsappSquare,
} from "react-icons/fa";
export default function Footer() {
  return (
    <section className="bg-warning-subtle py-5 position-relative overflow-hidden">
      <img
        className="position-absolute bottom-0 start-0"
        src="/img/footer/footer_wave_img.png"
        alt=""
      />

      <div className="container position-relative">
        <div className="row mb-5">
          <div className="col-lg-2 mb-4 mb-lg-0">
            <a className="d-inline-block mb-3" href="#">
              <img src="/images/logo.svg" alt="" />
            </a>
          </div>

          <div className="col-md-7 col-lg-6 mb-4 mb-lg-0">
            <div className="row">
              <div className="col-6 col-sm-4 mb-3">
                <h5 className="fw-bold mb-3">Platform</h5>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      Solutions
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      How it works
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block"
                      href="#"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-sm-4 mb-3">
                <h5 className="fw-bold mb-3">Resources</h5>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block"
                      href="#"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-4">
                <h5 className="fw-bold mb-3">Company</h5>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      Our Mission
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block mb-2"
                      href="#"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-secondary text-decoration-none d-block"
                      href="#"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-5 col-lg-4">
            <div className="bg-dark text-white rounded-3 p-4">
              <h5 className="mb-3">Your Source for Green Energy Updates</h5>
              <p className="small opacity-75 mb-4">
                Stay in the loop with our Green Horizon newsletter, where we
                deliver bite-sized insights into the latest green energy
                solutions.
              </p>
              <div className="d-flex flex-column">
                <input
                  type="email"
                  className="form-control mb-2 rounded-pill"
                  placeholder="Your e-mail..."
                />
                <a
                  href="#"
                  className="btn btn-warning text-success fw-semibold rounded-pill"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3">
          <div className="mb-3 d-flex">
            <Link href="#" className="text-dark me-3">
              <FaFacebook size={25} />
            </Link>
            <Link href="#" className="text-dark me-3">
              <FaInstagram size={25} />
            </Link>
            <Link href="#" className="text-dark">
              <FaWhatsappSquare size={25} />
            </Link>
          </div>
       
        </div>
      </div>
    </section>
  );
}
