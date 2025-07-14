import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook,FaInstagram,FaYoutube,FaWhatsappSquare } from "react-icons/fa";
export default function Footer() {
  return (
    <div className="d-full bg-black overlay-top">
      <div className="container  py-5 ">
        <div className="row ml-5">
          <div className="address col-md-4 footer-text ">
            <Link href="#" className="mb-3">
              <Image
                className="mb-3"
                src="/img/logo3.png"
                alt=""
                width={200}
                height={30}
              />
            </Link>
            <p>Address: Mirpur-02, Dhaka</p>
            <p>Phone: +65 11.188.888</p>
            <p>Email: hello@colorlib.com</p>
          </div>
          <div className="links col-md-4 footer-text">
            <h5 className="text-white mb-3">Important Links</h5>
            <p>Refund, Returns & Exchange Policy</p>
            <p>Discalimer For Basma</p>
            <p>Terms And Condition</p>
            <p>Contact Us</p>
          </div>
          <div className="follow col-md-4 footer-text">
            <h5 className="text-white mb-3">Follow Us On</h5>
            <div className="flex">
              <span className="footer_icons text-white fs-3 pe-3">
                <FaFacebook />
              </span>
              <span className="footer_icons text-white pe-3 fs-3">
                <FaYoutube />
              </span>
              <span className="footer_icons text-white pe-3 fs-3">
                <FaInstagram />
              </span>
              <span className="footer_icons text-white fs-3">
              <FaWhatsappSquare />
            </span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
